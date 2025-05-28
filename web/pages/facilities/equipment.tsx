import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import Modal from '../../components/ui/Modal';
import { BookingService } from '../../services/booking';
import { Asset } from '../../../packages/types/hr';
import { GetServerSideProps } from 'next';

interface AssetFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  serial_number: string;
  asset_tag: string;
  location: string;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  purchase_date: string;
  warranty_expiry: string;
  specifications: Record<string, any>;
  hourly_rate: number;
  daily_rate: number;
  responsible_person: string;
  maintenance_schedule: string;
  booking_rules: {
    max_duration_hours: number;
    advance_booking_hours: number;
    requires_approval: boolean;
    checkout_required: boolean;
  };
}

const categoryOptions = [
  'laptop', 'desktop', 'tablet', 'projector', 'camera', 'microphone', 
  'speakers', 'monitor', 'printer', 'scanner', 'phone', 'headset',
  'keyboard', 'mouse', 'cable', 'adapter', 'charger', 'other'
];

const conditionOptions = [
  { value: 'excellent', label: 'Excellent', color: 'text-green-600 bg-green-100' },
  { value: 'good', label: 'Good', color: 'text-blue-600 bg-blue-100' },
  { value: 'fair', label: 'Fair', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'poor', label: 'Poor', color: 'text-red-600 bg-red-100' }
];

const statusOptions = [
  { value: 'available', label: 'Available', color: 'text-green-600 bg-green-100' },
  { value: 'in_use', label: 'In Use', color: 'text-blue-600 bg-blue-100' },
  { value: 'maintenance', label: 'Maintenance', color: 'text-yellow-600 bg-yellow-100' },
  { value: 'retired', label: 'Retired', color: 'text-red-600 bg-red-100' }
];

const AssetFormModal = ({ 
  isOpen, 
  onClose, 
  asset, 
  onSave 
}: {
  isOpen: boolean;
  onClose: () => void;
  asset?: Asset | null;
  onSave: (data: AssetFormData) => void;
}) => {
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    description: '',
    category: '',
    brand: '',
    model: '',
    serial_number: '',
    asset_tag: '',
    location: '',
    status: 'available',
    condition: 'excellent',
    purchase_date: '',
    warranty_expiry: '',
    specifications: {},
    hourly_rate: 0,
    daily_rate: 0,
    responsible_person: '',
    maintenance_schedule: 'quarterly',
    booking_rules: {
      max_duration_hours: 168,
      advance_booking_hours: 24,
      requires_approval: false,
      checkout_required: true
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specifications, setSpecifications] = useState<Array<{key: string; value: string}>>([]);

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        description: asset.description || '',
        category: asset.category || '',
        brand: asset.brand || '',
        model: asset.model || '',
        serial_number: asset.serial_number || '',
        asset_tag: asset.asset_tag || '',
        location: asset.location || '',
        status: asset.status || 'available',
        condition: asset.condition || 'excellent',
        purchase_date: asset.purchase_date || '',
        warranty_expiry: asset.warranty_expiry || '',
        specifications: asset.specifications || {},
        hourly_rate: asset.hourly_rate || 0,
        daily_rate: asset.daily_rate || 0,
        responsible_person: asset.responsible_person || '',
        maintenance_schedule: asset.maintenance_schedule || 'quarterly',
        booking_rules: {
          max_duration_hours: asset.booking_rules?.max_duration_hours || 168,
          advance_booking_hours: asset.booking_rules?.advance_booking_hours || 24,
          requires_approval: asset.booking_rules?.requires_approval || false,
          checkout_required: asset.booking_rules?.checkout_required || true
        }
      });

      // Convert specifications object to array for editing
      const specsArray = Object.entries(asset.specifications || {}).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setSpecifications(specsArray);
    } else {
      // Reset form for new asset
      setFormData({
        name: '',
        description: '',
        category: '',
        brand: '',
        model: '',
        serial_number: '',
        asset_tag: '',
        location: '',
        status: 'available',
        condition: 'excellent',
        purchase_date: '',
        warranty_expiry: '',
        specifications: {},
        hourly_rate: 0,
        daily_rate: 0,
        responsible_person: '',
        maintenance_schedule: 'quarterly',
        booking_rules: {
          max_duration_hours: 168,
          advance_booking_hours: 24,
          requires_approval: false,
          checkout_required: true
        }
      });
      setSpecifications([]);
    }
  }, [asset, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert specifications array back to object
      const specsObject = specifications.reduce((acc, spec) => {
        if (spec.key && spec.value) {
          acc[spec.key] = spec.value;
        }
        return acc;
      }, {} as Record<string, any>);

      const dataToSave = {
        ...formData,
        specifications: specsObject
      };

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error('Error saving asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={asset ? 'Edit Equipment' : 'Add New Equipment'}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., MacBook Pro 16'"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              {categoryOptions.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the equipment"
          />
        </div>

        {/* Brand, Model, and Identifiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apple, Dell, HP, etc."
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <input
              type="text"
              id="model"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product model"
            />
          </div>

          <div>
            <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-2">
              Serial Number
            </label>
            <input
              type="text"
              id="serial_number"
              value={formData.serial_number}
              onChange={(e) => setFormData(prev => ({ ...prev, serial_number: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Manufacturer serial"
            />
          </div>

          <div>
            <label htmlFor="asset_tag" className="block text-sm font-medium text-gray-700 mb-2">
              Asset Tag
            </label>
            <input
              type="text"
              id="asset_tag"
              value={formData.asset_tag}
              onChange={(e) => setFormData(prev => ({ ...prev, asset_tag: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Internal asset tag"
            />
          </div>
        </div>

        {/* Status, Condition, and Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              id="condition"
              value={formData.condition}
              onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {conditionOptions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="IT Storage Room A"
            />
          </div>
        </div>

        {/* Dates and Responsible Person */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              id="purchase_date"
              value={formData.purchase_date}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="warranty_expiry" className="block text-sm font-medium text-gray-700 mb-2">
              Warranty Expiry
            </label>
            <input
              type="date"
              id="warranty_expiry"
              value={formData.warranty_expiry}
              onChange={(e) => setFormData(prev => ({ ...prev, warranty_expiry: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="responsible_person" className="block text-sm font-medium text-gray-700 mb-2">
              Responsible Person
            </label>
            <input
              type="text"
              id="responsible_person"
              value={formData.responsible_person}
              onChange={(e) => setFormData(prev => ({ ...prev, responsible_person: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Person responsible for this equipment"
            />
          </div>
        </div>

        {/* Rates and Maintenance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              id="hourly_rate"
              value={formData.hourly_rate}
              onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="daily_rate" className="block text-sm font-medium text-gray-700 mb-2">
              Daily Rate ($)
            </label>
            <input
              type="number"
              id="daily_rate"
              value={formData.daily_rate}
              onChange={(e) => setFormData(prev => ({ ...prev, daily_rate: parseFloat(e.target.value) || 0 }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="maintenance_schedule" className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Schedule
            </label>
            <select
              id="maintenance_schedule"
              value={formData.maintenance_schedule}
              onChange={(e) => setFormData(prev => ({ ...prev, maintenance_schedule: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="biannual">Bi-annual</option>
              <option value="annual">Annual</option>
              <option value="as_needed">As Needed</option>
            </select>
          </div>
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Technical Specifications
          </label>
          <div className="space-y-2">
            {specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                  placeholder="Specification name (e.g., RAM, Storage)"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                  placeholder="Value (e.g., 16GB, 512GB SSD)"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecification}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Specification
            </button>
          </div>
        </div>

        {/* Booking Rules */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Booking Rules</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Duration (hours)</label>
              <input
                type="number"
                value={formData.booking_rules.max_duration_hours}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  booking_rules: { ...prev.booking_rules, max_duration_hours: parseInt(e.target.value) || 0 }
                }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Advance Booking (hours)</label>
              <input
                type="number"
                value={formData.booking_rules.advance_booking_hours}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  booking_rules: { ...prev.booking_rules, advance_booking_hours: parseInt(e.target.value) || 0 }
                }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                min="1"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.booking_rules.requires_approval}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  booking_rules: { ...prev.booking_rules, requires_approval: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Requires Approval</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.booking_rules.checkout_required}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  booking_rules: { ...prev.booking_rules, checkout_required: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Physical Checkout Required</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : asset ? 'Update Equipment' : 'Create Equipment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const EquipmentInventoryPage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Access control
  useEffect(() => {
    if (!allowAccess && !['admin', 'manager', 'hr'].includes(role)) {
      router.push('/login?redirect=/facilities/equipment');
    }
  }, [allowAccess, role, router]);

  // Load assets
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setIsLoading(true);
      const assetsData = await BookingService.getAssets('org1');
      setAssets(assetsData);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAsset = () => {
    setSelectedAsset(null);
    setIsAssetModalOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsAssetModalOpen(true);
  };

  const handleSaveAsset = async (formData: AssetFormData) => {
    try {
      if (selectedAsset) {
        await BookingService.updateAsset(selectedAsset.id, formData);
      } else {
        await BookingService.createAsset({
          ...formData,
          org_id: 'org1'
        });
      }
      await loadAssets();
      setIsAssetModalOpen(false);
    } catch (error) {
      console.error('Error saving asset:', error);
      throw error;
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (confirm('Are you sure you want to delete this equipment? This action cannot be undone.')) {
      try {
        await BookingService.deleteAsset(assetId);
        await loadAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serial_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || asset.category === filterCategory;
    const matchesStatus = !filterStatus || asset.status === filterStatus;
    const matchesCondition = !filterCondition || asset.condition === filterCondition;

    return matchesSearch && matchesCategory && matchesStatus && matchesCondition;
  });

  const getUniqueCategories = () => {
    return Array.from(new Set(assets.map(asset => asset.category).filter(Boolean)));
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption?.color || 'text-gray-600 bg-gray-100';
  };

  const getConditionColor = (condition: string) => {
    const conditionOption = conditionOptions.find(opt => opt.value === condition);
    return conditionOption?.color || 'text-gray-600 bg-gray-100';
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
        <title>Equipment Inventory - HR Portal</title>
        <meta name="description" content="Manage equipment inventory and asset tracking" />
      </Head>

      <DashboardLayout>
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Equipment Inventory</h1>
              <p className="text-gray-600">Manage equipment, assets, and inventory tracking</p>
            </div>
            <button
              onClick={handleCreateAsset}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Equipment
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, brand, model, or serial..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Conditions</option>
                  {conditionOptions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Equipment Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">💻</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterCategory || filterStatus || filterCondition ? 'No equipment found' : 'No equipment yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory || filterStatus || filterCondition 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first piece of equipment.'}
              </p>
              {!searchTerm && !filterCategory && !filterStatus && !filterCondition && (
                <button
                  onClick={handleCreateAsset}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Your First Equipment
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                        <p className="text-sm text-gray-600">
                          {asset.brand && asset.model ? `${asset.brand} ${asset.model}` : 
                           asset.brand || asset.model || 'No brand/model'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAsset(asset)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Equipment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Equipment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {asset.description && (
                      <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Category: {asset.category?.charAt(0).toUpperCase() + asset.category?.slice(1)}
                      </div>

                      {asset.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {asset.location}
                        </div>
                      )}

                      {asset.serial_number && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          S/N: {asset.serial_number}
                        </div>
                      )}
                    </div>

                    {asset.specifications && Object.keys(asset.specifications).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-1">Specifications:</p>
                        <div className="space-y-1">
                          {Object.entries(asset.specifications).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="text-xs text-gray-600">
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                          {Object.keys(asset.specifications).length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{Object.keys(asset.specifications).length - 3} more specs
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(asset.status)}`}>
                          {statusOptions.find(opt => opt.value === asset.status)?.label || asset.status}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getConditionColor(asset.condition)}`}>
                          {conditionOptions.find(opt => opt.value === asset.condition)?.label || asset.condition}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => router.push(`/bookings?asset=${asset.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Bookings →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Asset Form Modal */}
        <AssetFormModal
          isOpen={isAssetModalOpen}
          onClose={() => setIsAssetModalOpen(false)}
          asset={selectedAsset}
          onSave={handleSaveAsset}
        />
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


export default EquipmentInventoryPage; 
