import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import { BookingService } from '../../services/booking';
import { MeetingRoom, Asset, RoomBooking, AssetBooking } from '../../../packages/types/hr';
import { GetServerSideProps } from 'next';

interface ReportMetrics {
  totalRooms: number;
  totalAssets: number;
  totalBookings: number;
  utilizationRate: number;
  topUsedRooms: Array<{ name: string; bookings: number; utilization: number }>;
  topUsedAssets: Array<{ name: string; bookings: number; utilization: number }>;
  bookingsByMonth: Array<{ month: string; rooms: number; assets: number }>;
  categoryDistribution: Array<{ category: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
  maintenanceAlerts: Array<{ id: string; name: string; type: string; issue: string }>;
}

const ResourceReportsPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  
  const [isLoading, setIsLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState('last_30_days');
  const [reportType, setReportType] = useState('overview');
  const [metrics, setMetrics] = useState<ReportMetrics>({
    totalRooms: 0,
    totalAssets: 0,
    totalBookings: 0,
    utilizationRate: 0,
    topUsedRooms: [],
    topUsedAssets: [],
    bookingsByMonth: [],
    categoryDistribution: [],
    statusDistribution: [],
    maintenanceAlerts: []
  });

  // Access control
  useEffect(() => {
    if (!allowAccess && !['admin', 'manager', 'hr'].includes(role)) {
      router.push('/login?redirect=/facilities/reports');
    }
  }, [allowAccess, role, router]);

  // Load report data
  useEffect(() => {
    loadReportData();
  }, [reportPeriod]);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch basic data
      const [rooms, assets, roomBookings, assetBookings] = await Promise.all([
        BookingService.getMeetingRooms('org1'),
        BookingService.getAssets('org1'),
        BookingService.getRoomBookings('org1'),
        BookingService.getAssetBookings('org1')
      ]);

      // Calculate metrics
      const totalBookings = roomBookings.length + assetBookings.length;
      const utilizationRate = totalBookings > 0 ? 
        Math.round((totalBookings / (rooms.length + assets.length)) * 100) : 0;

      // Top used rooms
      const roomBookingCounts = roomBookings.reduce((acc, booking) => {
        acc[booking.room_id] = (acc[booking.room_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topUsedRooms = rooms
        .map(room => ({
          name: room.name,
          bookings: roomBookingCounts[room.id] || 0,
          utilization: Math.round(((roomBookingCounts[room.id] || 0) / roomBookings.length) * 100)
        }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      // Top used assets
      const assetBookingCounts = assetBookings.reduce((acc, booking) => {
        acc[booking.asset_id] = (acc[booking.asset_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topUsedAssets = assets
        .map(asset => ({
          name: asset.name,
          bookings: assetBookingCounts[asset.id] || 0,
          utilization: Math.round(((assetBookingCounts[asset.id] || 0) / assetBookings.length) * 100)
        }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      // Bookings by month (last 6 months)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const bookingsByMonth = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = monthNames[date.getMonth()];
        
        const roomCount = roomBookings.filter(booking => {
          const bookingDate = new Date(booking.start_time);
          return bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        }).length;
        
        const assetCount = assetBookings.filter(booking => {
          const bookingDate = new Date(booking.start_time);
          return bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        }).length;

        return { month, rooms: roomCount, assets: assetCount };
      }).reverse();

      // Category distribution
      const categoryCount = assets.reduce((acc, asset) => {
        acc[asset.category] = (acc[asset.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const categoryDistribution = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      // Status distribution
      const statusCount = assets.reduce((acc, asset) => {
        acc[asset.status] = (acc[asset.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusDistribution = Object.entries(statusCount)
        .map(([status, count]) => ({ status, count }));

      // Maintenance alerts (mock data for demo)
      const maintenanceAlerts = assets
        .filter(asset => {
          if (asset.warranty_expiry) {
            const expiryDate = new Date(asset.warranty_expiry);
            const warningDate = new Date();
            warningDate.setMonth(warningDate.getMonth() + 3); // 3 months warning
            return expiryDate <= warningDate;
          }
          return false;
        })
        .slice(0, 5)
        .map(asset => ({
          id: asset.id,
          name: asset.name,
          type: 'warranty_expiry',
          issue: `Warranty expires ${asset.warranty_expiry}`
        }));

      setMetrics({
        totalRooms: rooms.length,
        totalAssets: assets.length,
        totalBookings,
        utilizationRate,
        topUsedRooms,
        topUsedAssets,
        bookingsByMonth,
        categoryDistribution,
        statusDistribution,
        maintenanceAlerts
      });

    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon,
    color = 'blue'
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'yellow' | 'purple';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      yellow: 'bg-yellow-500 text-yellow-100',
      purple: 'bg-purple-500 text-purple-100'
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl font-bold text-gray-900">{value}</dd>
              {subtitle && <dd className="text-sm text-gray-500">{subtitle}</dd>}
            </dl>
          </div>
        </div>
      </div>
    );
  };

  if (!allowAccess && !['admin', 'manager', 'hr'].includes(role)) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Resource Reports & Analytics - HR Portal</title>
        <meta name="description" content="Analytics and reports for facilities and resource management" />
      </Head>

      <DashboardLayout>
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resource Reports & Analytics</h1>
              <p className="text-gray-600">Insights and analytics for facilities and resource management</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => exportReport('csv')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportReport('pdf')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Period</label>
                <select
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="last_90_days">Last 90 Days</option>
                  <option value="last_6_months">Last 6 Months</option>
                  <option value="last_year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="overview">Overview</option>
                  <option value="utilization">Utilization</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="financial">Financial</option>
                  <option value="trends">Trends</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading analytics...</p>
            </div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Total Meeting Rooms"
                  value={metrics.totalRooms}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                  color="blue"
                />
                
                <MetricCard
                  title="Total Equipment"
                  value={metrics.totalAssets}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  }
                  color="green"
                />
                
                <MetricCard
                  title="Total Bookings"
                  value={metrics.totalBookings}
                  subtitle={`${reportPeriod.replace('_', ' ')}`}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  color="purple"
                />
                
                <MetricCard
                  title="Utilization Rate"
                  value={`${metrics.utilizationRate}%`}
                  subtitle="Average resource usage"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                  color="yellow"
                />
              </div>

              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Bookings Trend */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
                  <div className="space-y-4">
                    {metrics.bookingsByMonth.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                        <div className="flex-1 mx-4">
                          <div className="flex space-x-2">
                            <div className="flex-1">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${Math.min((month.rooms / Math.max(...metrics.bookingsByMonth.map(m => m.rooms))) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">Rooms: {month.rooms}</span>
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${Math.min((month.assets / Math.max(...metrics.bookingsByMonth.map(m => m.assets))) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">Equipment: {month.assets}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Categories</h3>
                  <div className="space-y-3">
                    {metrics.categoryDistribution.slice(0, 6).map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {category.category.replace('_', ' ')}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(category.count / Math.max(...metrics.categoryDistribution.map(c => c.count))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Used Resources */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Rooms */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Meeting Rooms</h3>
                  <div className="space-y-3">
                    {metrics.topUsedRooms.map((room, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{room.name}</p>
                          <p className="text-xs text-gray-500">{room.bookings} bookings</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${room.utilization}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{room.utilization}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Equipment */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Equipment</h3>
                  <div className="space-y-3">
                    {metrics.topUsedAssets.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                          <p className="text-xs text-gray-500">{asset.bookings} bookings</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${asset.utilization}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{asset.utilization}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Overview & Maintenance Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Status</h3>
                  <div className="space-y-3">
                    {metrics.statusDistribution.map((status, index) => {
                      const colors = {
                        available: 'bg-green-500',
                        in_use: 'bg-blue-500',
                        maintenance: 'bg-yellow-500',
                        retired: 'bg-red-500'
                      };
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${colors[status.status as keyof typeof colors] || 'bg-gray-500'}`}></div>
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {status.status.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">{status.count} items</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Maintenance Alerts */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Alerts</h3>
                  {metrics.maintenanceAlerts.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="text-3xl text-gray-300 mb-2">✅</div>
                      <p className="text-sm text-gray-500">No maintenance alerts</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {metrics.maintenanceAlerts.map((alert, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{alert.name}</p>
                            <p className="text-xs text-gray-600">{alert.issue}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default ResourceReportsPage; 
