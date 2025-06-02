import Link from "next/link";
import React, { useState } from "react";

interface Asset {
  id: number;
  name: string;
  type: string;
  serialNumber: string;
  assignedTo: string;
  location: string;
  status: "Available" | "Assigned" | "Maintenance" | "Retired";
  purchaseDate: string;
  value: number;
}

const AssetsManagement = () => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      name: 'MacBook Pro 16"',
      type: "Laptop",
      serialNumber: "MBP2023001",
      assignedTo: "John Doe",
      location: "Engineering Floor",
      status: "Assigned",
      purchaseDate: "2023-01-15",
      value: 2500,
    },
    {
      id: 2,
      name: 'Dell Monitor 27"',
      type: "Monitor",
      serialNumber: "DM2023002",
      assignedTo: "Jane Smith",
      location: "HR Office",
      status: "Assigned",
      purchaseDate: "2023-03-10",
      value: 350,
    },
    {
      id: 3,
      name: "iPhone 14 Pro",
      type: "Mobile Device",
      serialNumber: "IP2023003",
      assignedTo: "",
      location: "IT Storage",
      status: "Available",
      purchaseDate: "2023-05-20",
      value: 1000,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    serialNumber: "",
    assignedTo: "",
    location: "",
    status: "Available" as const,
    purchaseDate: "",
    value: 0,
  });

  const navigation = [
    { name: "Dashboard", href: "/dashboard-modern" },
    { name: "People", href: "/people-modern" },
    { name: "Jobs", href: "/jobs-modern" },
    { name: "Leave", href: "/leave-modern" },
    { name: "Assets", href: "/assets-modern", current: true },
  ];

  const assetTypes = [
    "Laptop",
    "Desktop",
    "Monitor",
    "Mobile Device",
    "Tablet",
    "Printer",
    "Camera",
    "Audio Equipment",
    "Office Furniture",
    "Other",
  ];

  const statusOptions = ["Available", "Assigned", "Maintenance", "Retired"];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || asset.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const asset: Asset = {
      ...newAsset,
      id: Math.max(...assets.map((asset) => asset.id)) + 1,
    };
    setAssets([...assets, asset]);
    setNewAsset({
      name: "",
      type: "",
      serialNumber: "",
      assignedTo: "",
      location: "",
      status: "Available",
      purchaseDate: "",
      value: 0,
    });
    setShowAddForm(false);
  };

  const handleDeleteAsset = (id: number) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      setAssets(assets.filter((asset) => asset.id !== id));
    }
  };

  const updateAssetStatus = (id: number, newStatus: Asset["status"]) => {
    setAssets(
      assets.map((asset) =>
        asset.id === id ? { ...asset, status: newStatus } : asset,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">HR Portal</h1>
              <div className="ml-10 flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Assets Management
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add Asset
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Assets
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {assets.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Assigned Assets
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {assets.filter((asset) => asset.status === "Assigned").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Available Assets
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {assets.filter((asset) => asset.status === "Available").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <p className="text-2xl font-bold text-purple-600">
                $
                {assets
                  .reduce((sum, asset) => sum + asset.value, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Assets
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, serial number, or assignee..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Assets Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {asset.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asset.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.assignedTo || "Unassigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          asset.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : asset.status === "Assigned"
                              ? "bg-blue-100 text-blue-800"
                              : asset.status === "Maintenance"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${asset.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <select
                        value={asset.status}
                        onChange={(e) =>
                          updateAssetStatus(
                            asset.id,
                            e.target.value as Asset["status"],
                          )
                        }
                        className="text-blue-600 hover:text-blue-900 mr-4 border-none bg-transparent"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Asset Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Add New Asset
                </h3>
                <form onSubmit={handleAddAsset} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Asset Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newAsset.name}
                      onChange={(e) =>
                        setNewAsset({ ...newAsset, name: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      required
                      value={newAsset.type}
                      onChange={(e) =>
                        setNewAsset({ ...newAsset, type: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      {assetTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      required
                      value={newAsset.serialNumber}
                      onChange={(e) =>
                        setNewAsset({
                          ...newAsset,
                          serialNumber: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={newAsset.location}
                      onChange={(e) =>
                        setNewAsset({ ...newAsset, location: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newAsset.purchaseDate}
                      onChange={(e) =>
                        setNewAsset({
                          ...newAsset,
                          purchaseDate: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Value ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newAsset.value}
                      onChange={(e) =>
                        setNewAsset({
                          ...newAsset,
                          value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Add Asset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssetsManagement;
