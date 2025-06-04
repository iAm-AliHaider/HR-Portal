import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "../../components/layout/Layout";

import { GetServerSideProps } from "next";

import { useToast } from "../../hooks/useApi";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  position: string;
  hire_date: string;
  status: "active" | "inactive" | "terminated";
  phone?: string;
  address?: string;
  salary?: number;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    position: "Senior Software Engineer",
    hire_date: "2023-01-15",
    status: "active",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA",
    salary: 120000,
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@company.com",
    department: "Sales",
    position: "Sales Manager",
    hire_date: "2022-08-20",
    status: "active",
    phone: "+1 (555) 234-5678",
    address: "456 Business Ave, New York, NY",
    salary: 95000,
  },
  {
    id: 3,
    first_name: "Bob",
    last_name: "Wilson",
    email: "bob.wilson@company.com",
    department: "Human Resources",
    position: "HR Manager",
    hire_date: "2023-03-10",
    status: "active",
    phone: "+1 (555) 345-6789",
    address: "789 HR Plaza, Chicago, IL",
    salary: 85000,
  },
  {
    id: 4,
    first_name: "Alice",
    last_name: "Brown",
    email: "alice.brown@company.com",
    department: "Marketing",
    position: "Marketing Specialist",
    hire_date: "2023-06-01",
    status: "active",
    phone: "+1 (555) 456-7890",
    address: "321 Marketing Blvd, Los Angeles, CA",
    salary: 70000,
  },
];

const PeopleDirectory = () => {
  const router = useRouter();
  const toast = useToast();

  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    position: "",
    hire_date: "",
    phone: "",
    address: "",
    salary: "",
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const departments = [
    "Engineering",
    "Sales",
    "Human Resources",
    "Marketing",
    "Finance",
    "Operations",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const employeeData: Employee = {
        id: editingEmployee ? editingEmployee.id : Date.now(),
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        hire_date: formData.hire_date,
        status: "active",
        phone: formData.phone,
        address: formData.address,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
      };

      // Simulate API call
      setTimeout(() => {
        if (editingEmployee) {
          // Update existing employee
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.id === editingEmployee.id ? employeeData : emp,
            ),
          );
        } else {
          // Add new employee
          setEmployees((prev) => [employeeData, ...prev]);
        }

        setShowForm(false);
        setEditingEmployee(null);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          department: "",
          position: "",
          hire_date: "",
          phone: "",
          address: "",
          salary: "",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to save employee:", error);
      setLoading(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      hire_date: employee.hire_date,
      phone: employee.phone || "",
      address: employee.address || "",
      salary: employee.salary?.toString() || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setEmployees((prev) => prev.filter((emp) => emp.id !== id));
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to delete employee:", error);
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (
    id: number,
    status: "active" | "inactive" | "terminated",
  ) => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === id ? { ...emp, status } : emp)),
        );
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to update employee status:", error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesFilter = filter === "all" || emp.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: employees.length,
    active: employees.filter((emp) => emp.status === "active").length,
    departments: new Set(employees.map((emp) => emp.department)).size,
    thisMonth: employees.filter((emp) => {
      const hireDate = new Date(emp.hire_date);
      const now = new Date();
      return (
        hireDate.getMonth() === now.getMonth() &&
        hireDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Head>
          <title>People Management | HR Portal</title>
        </Head>

        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                People Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage employee information and records
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              + Add Employee
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Total Employees
              </h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Active</h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">Departments</h3>
              <p className="text-3xl font-bold text-purple-600">
                {stats.departments}
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">
                New This Month
              </h3>
              <p className="text-3xl font-bold text-orange-600">
                {stats.thisMonth}
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              {(["all", "active", "inactive"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === status
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hire Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                      {employee.status === "active" && (
                        <button
                          onClick={() =>
                            handleStatusChange(employee.id, "inactive")
                          }
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Deactivate
                        </button>
                      )}
                      {employee.status === "inactive" && (
                        <button
                          onClick={() =>
                            handleStatusChange(employee.id, "active")
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Employee Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingEmployee ? "Edit Employee" : "Add New Employee"}
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          required
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter first name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          required
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Department
                        </label>
                        <select
                          id="department"
                          name="department"
                          required
                          value={formData.department}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="position"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Position
                        </label>
                        <input
                          type="text"
                          id="position"
                          name="position"
                          required
                          value={formData.position}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter position title"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="hire_date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Hire Date
                        </label>
                        <input
                          type="date"
                          id="hire_date"
                          name="hire_date"
                          required
                          value={formData.hire_date}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="salary"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Salary (Optional)
                        </label>
                        <input
                          type="number"
                          id="salary"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter annual salary"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address (Optional)
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter address"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingEmployee(null);
                          setFormData({
                            first_name: "",
                            last_name: "",
                            email: "",
                            department: "",
                            position: "",
                            hire_date: "",
                            phone: "",
                            address: "",
                            salary: "",
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading
                          ? "Saving..."
                          : editingEmployee
                            ? "Update Employee"
                            : "Add Employee"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PeopleDirectory;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
