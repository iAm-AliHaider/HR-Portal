import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import {
  Building,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Laptop,
  Monitor,
  Projector,
  Headphones,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  FileText,
  PieChart,
  TrendingUp,
  Package,
} from "lucide-react";
import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

// Force Server-Side Rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

// Mock data
const meetingRooms = [
  {
    id: 1,
    name: "Conference Room A",
    capacity: 10,
    floor: "3rd Floor",
    features: ["Projector", "Whiteboard", "Video Conference"],
    status: "available",
    nextBooking: "2:00 PM - 3:00 PM",
  },
  {
    id: 2,
    name: "Board Room",
    capacity: 20,
    floor: "5th Floor",
    features: ["Large Screen", "Video Conference", "Audio System"],
    status: "occupied",
    currentBooking: "Strategy Meeting - Until 1:00 PM",
  },
  {
    id: 3,
    name: "Small Meeting Room 1",
    capacity: 4,
    floor: "2nd Floor",
    features: ["TV Screen", "Whiteboard"],
    status: "available",
    nextBooking: "4:00 PM - 5:00 PM",
  },
];

const equipment = [
  {
    id: 1,
    name: "Dell Laptop #1",
    type: "Laptop",
    status: "available",
    specifications: "Intel i5, 8GB RAM, 256GB SSD",
    lastBooked: "John Doe - 2 days ago",
  },
  {
    id: 2,
    name: "Projector - Epson",
    type: "Projector",
    status: "booked",
    specifications: "1080p, HDMI, VGA",
    currentBooking: "Sarah Smith - Until 5:00 PM",
  },
  {
    id: 3,
    name: "Conference Camera",
    type: "Camera",
    status: "available",
    specifications: "4K, Wide Angle, USB-C",
    lastBooked: "Mike Johnson - 1 week ago",
  },
];

const recentBookings = [
  {
    id: 1,
    resource: "Conference Room A",
    type: "room",
    bookedBy: "John Doe",
    date: "2024-01-10",
    time: "10:00 AM - 12:00 PM",
    status: "upcoming",
  },
  {
    id: 2,
    resource: "Dell Laptop #1",
    type: "equipment",
    bookedBy: "Sarah Smith",
    date: "2024-01-09",
    time: "All Day",
    status: "active",
  },
];

export default function FacilitiesPage() {
  const router = useRouter();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFloor, setFilterFloor] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Set active tab based on URL query parameter
  useEffect(() => {
    if (router.query.tab) {
      const tab = router.query.tab as string;
      if (["rooms", "equipment", "reports"].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [router.query.tab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(
      {
        pathname: router.pathname,
        query: { tab },
      },
      undefined,
      { shallow: true },
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case "occupied":
      case "booked":
        return <Badge className="bg-red-100 text-red-800">Occupied</Badge>;
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      case "projector":
        return <Projector className="h-5 w-5" />;
      case "camera":
        return <Monitor className="h-5 w-5" />;
      case "headset":
        return <Headphones className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <ModernDashboardLayout
      title="Facilities Management"
      subtitle="Manage meeting rooms, equipment, and facility resources"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Available Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">8/12</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Equipment Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">15/20</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Today's Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-purple-500 mr-2" />
              <div className="text-2xl font-bold">24</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Maintenance Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold">3</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="rooms">
            <Building className="mr-2 h-4 w-4" />
            Meeting Rooms
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Package className="mr-2 h-4 w-4" />
            Equipment Booking
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Meeting Rooms Tab */}
        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Meeting Rooms</CardTitle>
                  <CardDescription>
                    Book and manage conference rooms
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Book Room
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search rooms..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterFloor} onValueChange={setFilterFloor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    <SelectItem value="2">2nd Floor</SelectItem>
                    <SelectItem value="3">3rd Floor</SelectItem>
                    <SelectItem value="5">5th Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Room List */}
              <div className="space-y-4">
                {meetingRooms.map((room) => (
                  <div
                    key={room.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{room.name}</h3>
                          {getStatusBadge(room.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Capacity: {room.capacity}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {room.floor}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {room.features.map((feature, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm">
                          {room.status === "available" ? (
                            <span className="text-gray-600">
                              Next booking:{" "}
                              <span className="font-medium">
                                {room.nextBooking}
                              </span>
                            </span>
                          ) : (
                            <span className="text-red-600">
                              {room.currentBooking}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Schedule
                        </Button>
                        {room.status === "available" && (
                          <Button size="sm">Book Now</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Equipment Booking</CardTitle>
                  <CardDescription>
                    Reserve laptops, projectors, and other equipment
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Book Equipment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getEquipmentIcon(item.type)}
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.specifications}
                        </p>
                        <div className="text-sm">
                          {item.status === "available" ? (
                            <span className="text-gray-600">
                              Last booked: {item.lastBooked}
                            </span>
                          ) : (
                            <span className="text-red-600">
                              {item.currentBooking}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View History
                        </Button>
                        {item.status === "available" && (
                          <Button size="sm">Book Now</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Room Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Conference Room A</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-500"></div>
                      </div>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Board Room</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-[60%] h-full bg-blue-500"></div>
                      </div>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Small Meeting Room 1</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-[45%] h-full bg-blue-500"></div>
                      </div>
                      <span className="text-sm text-gray-600">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Equipment Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Laptops</span>
                    <Badge className="bg-green-100 text-green-800">+12%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Projectors</span>
                    <Badge className="bg-red-100 text-red-800">-5%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cameras</span>
                    <Badge className="bg-green-100 text-green-800">+8%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Latest facility and equipment bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium text-gray-500">
                        Resource
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-gray-500">
                        Type
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-gray-500">
                        Booked By
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-gray-500">
                        Date & Time
                      </th>
                      <th className="text-left py-2 px-4 font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">{booking.resource}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize">
                            {booking.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{booking.bookedBy}</td>
                        <td className="py-3 px-4">
                          {booking.date} • {booking.time}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              booking.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ModernDashboardLayout>
  );
}
