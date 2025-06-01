import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import {
  Briefcase,
  Building,
  Calendar,
  Edit,
  Grid,
  List,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { GetServerSideProps } from "next";

import {
  CardGrid,
  PageLayout,
  SearchFilterBar,
  StatsCard,
} from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";

import {
  useForm,
  useModal,
  usePagination,
  useSearch,
  useToast,
} from "../../hooks/useApi";

// Employee form interface
interface EmployeeForm {
  name: string;
  email: string;
  department: string;
  position: string;
  location: string;
  phone: string;
  salary: number;
  manager_id: string;
  hire_date: string;
}

const PeopleDirectory = () => {
  const router = useRouter();
  const toast = useToast();

  // Define local state for employees management instead of using the hook
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create employee action functions
  const createEmployee = async (employeeData: any) => {
    try {
      if (supabase) {
        const { data, error: createError } = await supabase
          .from("employees")
          .insert([employeeData])
          .select();

        if (createError) throw createError;

        const newId = data && data.length > 0 ? data[0].id : Date.now();
        // Refresh employees list
        setEmployees((prev) => [...prev, { ...employeeData, id: newId }]);
        return data || [];
      } else {
        // Mock operation for demo
        const newEmployee = {
          ...employeeData,
          id: Date.now(),
          status: "active",
        };
        setEmployees((prev) => [...prev, newEmployee]);
        return newEmployee;
      }
    } catch (err) {
      console.error("Error creating employee:", err);
      throw err;
    }
  };

  const updateEmployee = async (id: number | string, employeeData: any) => {
    try {
      if (supabase) {
        const { data, error: updateError } = await supabase
          .from("employees")
          .update(employeeData)
          .eq("id", id);

        if (updateError) throw updateError;

        // Update local state
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === id ? { ...emp, ...employeeData } : emp,
          ),
        );
        return data;
      } else {
        // Mock operation for demo
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === id ? { ...emp, ...employeeData } : emp,
          ),
        );
        return employeeData;
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      throw err;
    }
  };

  const deleteEmployee = async (id: number | string) => {
    try {
      if (supabase) {
        const { error: deleteError } = await supabase
          .from("employees")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;
      }

      // Update local state
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
      throw err;
    }
  };

  // UI state
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modals
  const addModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  // Search and pagination
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(employees, [
    "name",
    "email",
    "department",
    "position",
  ]);
  const {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
  } = usePagination(filteredItems, 12);

  // Form management
  const form = useForm<EmployeeForm>({
    name: "",
    email: "",
    department: "",
    position: "",
    location: "",
    phone: "",
    salary: 0,
    manager_id: "",
    hire_date: "",
  });

  // Mock departments and locations for the demo
  const departments = [
    "Engineering",
    "HR",
    "Marketing",
    "Finance",
    "Sales",
    "Design",
    "Operations",
  ];
  const locations = [
    "New York",
    "San Francisco",
    "London",
    "Remote",
    "Tokyo",
    "Berlin",
  ];

  // Mock data for employees
  const mockEmployees = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Engineering",
      position: "Senior Developer",
      location: "San Francisco",
      phone: "+1 (555) 123-4567",
      hire_date: "2022-04-15",
      status: "active",
      avatar: "/avatars/user-01.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "Marketing",
      position: "Marketing Manager",
      location: "New York",
      phone: "+1 (555) 987-6543",
      hire_date: "2021-08-10",
      status: "active",
      avatar: "/avatars/user-02.jpg",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.j@company.com",
      department: "HR",
      position: "HR Director",
      location: "Remote",
      phone: "+1 (555) 456-7890",
      hire_date: "2020-02-28",
      status: "active",
      avatar: "/avatars/user-03.jpg",
    },
  ];

  // Fetch employees from Supabase or use mock data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);

        // Check if supabase is initialized
        if (typeof supabase !== "undefined" && supabase !== null) {
          try {
            const { data, error } = await supabase
              .from("employees")
              .select("*")
              .order("name", { ascending: true });

            if (error) throw error;

            // Use real data if available, otherwise fall back to mock data
            setEmployees(data && data.length > 0 ? data : mockEmployees);
          } catch (supabaseError) {
            console.error("Supabase error:", supabaseError);
            setError(
              "Failed to load employees from database. Using demo data instead.",
            );
            setEmployees(mockEmployees); // Fallback to mock data
          }
        } else {
          console.log("Supabase client not available, using mock data");
          setEmployees(mockEmployees); // Use mock data
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Using demo data instead.");
        setEmployees(mockEmployees); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    form.setValue(name as keyof EmployeeForm, value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      if (selectedEmployee) {
        // Update existing employee
        await updateEmployee(selectedEmployee.id, form.values);
        toast.success("Employee updated successfully");
        editModal.closeModal();
      } else {
        // Create new employee
        await createEmployee({
          ...form.values,
          status: "active",
          created_at: new Date().toISOString(),
        });
        toast.success("Employee added successfully");
        addModal.closeModal();
      }

      // Reset form
      form.reset();
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Failed to save employee data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);

    // Set form values
    Object.keys(form.values).forEach((key) => {
      if (employee[key] !== undefined) {
        form.setValue(key as keyof EmployeeForm, employee[key]);
      }
    });

    editModal.openModal();
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      setIsSubmitting(true);
      await deleteEmployee(selectedEmployee.id);
      toast.success("Employee removed successfully");
      deleteModal.closeModal();
      setSelectedEmployee(null);
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error("Failed to delete employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Department counts for stats
  const departmentCounts = departments.reduce(
    (acc, dept) => {
      acc[dept] = employees.filter((emp) => emp.department === dept).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <PageLayout
      title="People Directory"
      description="Manage employee information and organization structure"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "People" },
      ]}
      actionButton={{
        label: "Add Employee",
        onClick: addModal.openModal,
        icon: <UserPlus className="h-4 w-4" strokeWidth={1.5} />,
      }}
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Employees"
          value={employees.length}
          description="Across all departments"
          icon={<Users className="h-5 w-5" strokeWidth={1.5} />}
        />
        <StatsCard
          title="Departments"
          value={departments.length}
          description="Organization units"
          icon={<Building className="h-5 w-5" strokeWidth={1.5} />}
        />
        <StatsCard
          title="Locations"
          value={locations.length}
          description="Office locations"
          icon={<MapPin className="h-5 w-5" strokeWidth={1.5} />}
        />
        <StatsCard
          title="New Hires"
          value="3"
          description="Last 30 days"
          icon={<Calendar className="h-5 w-5" strokeWidth={1.5} />}
        />
      </div>

      {/* Search and Filters */}
      <SearchFilterBar>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            onValueChange={(value) =>
              setSearchTerm(value !== "all" ? value : "")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("cards")}
            className={viewMode === "cards" ? "bg-zinc-100" : ""}
          >
            <Grid className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-zinc-100" : ""}
          >
            <List className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </SearchFilterBar>

      {/* Employee List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
        </div>
      ) : (
        <>
          {viewMode === "cards" ? (
            <CardGrid columns={3}>
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {employee.avatar ? (
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-zinc-200 flex items-center justify-center">
                            <User
                              className="h-6 w-6 text-zinc-500"
                              strokeWidth={1.5}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-medium text-zinc-900 truncate">
                          {employee.name}
                        </h2>
                        <p className="mt-1 text-sm text-zinc-500 flex items-center">
                          <Briefcase
                            className="w-3 h-3 mr-1 inline"
                            strokeWidth={1.5}
                          />
                          {employee.position}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500 flex items-center">
                          <Building
                            className="w-3 h-3 mr-1 inline"
                            strokeWidth={1.5}
                          />
                          {employee.department}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-zinc-500 flex items-center">
                        <Mail
                          className="w-4 h-4 mr-2 text-zinc-400"
                          strokeWidth={1.5}
                        />
                        {employee.email}
                      </p>
                      {employee.phone && (
                        <p className="text-sm text-zinc-500 flex items-center">
                          <Phone
                            className="w-4 h-4 mr-2 text-zinc-400"
                            strokeWidth={1.5}
                          />
                          {employee.phone}
                        </p>
                      )}
                      {employee.location && (
                        <p className="text-sm text-zinc-500 flex items-center">
                          <MapPin
                            className="w-4 h-4 mr-2 text-zinc-400"
                            strokeWidth={1.5}
                          />
                          {employee.location}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        <Edit className="h-3 w-3 mr-1" strokeWidth={1.5} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          deleteModal.openModal();
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" strokeWidth={1.5} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEmployees.length === 0 && (
                <div className="col-span-full flex justify-center items-center h-64 bg-zinc-50 rounded-lg border border-zinc-200">
                  <div className="text-center">
                    <User
                      className="h-10 w-10 text-zinc-400 mx-auto mb-3"
                      strokeWidth={1.5}
                    />
                    <h3 className="text-zinc-500 text-lg">
                      No employees found
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </div>
              )}
            </CardGrid>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-zinc-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {employee.avatar ? (
                              <img
                                src={employee.avatar}
                                alt={employee.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center">
                                <User
                                  className="h-5 w-5 text-zinc-500"
                                  strokeWidth={1.5}
                                />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-zinc-900">
                              {employee.name}
                            </div>
                            <div className="text-sm text-zinc-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-900">
                          {employee.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-900">
                          {employee.position}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-900">
                          {employee.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            employee.status === "active"
                              ? "bg-green-100 text-green-800"
                              : employee.status === "inactive"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                        >
                          <Edit className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            deleteModal.openModal();
                          }}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredEmployees.length === 0 && (
                <div className="flex justify-center items-center h-64 bg-white">
                  <div className="text-center">
                    <User
                      className="h-10 w-10 text-zinc-400 mx-auto mb-3"
                      strokeWidth={1.5}
                    />
                    <h3 className="text-zinc-500 text-lg">
                      No employees found
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Employee Modal */}
      {addModal.isOpen && (
        <Dialog open={true} onOpenChange={() => addModal.closeModal()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the employee details below to add them to the directory.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={form.values.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.values.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Department
                    </label>
                    <Select
                      name="department"
                      value={form.values.department}
                      onValueChange={(value) =>
                        form.setValue("department", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Position
                    </label>
                    <Input
                      id="position"
                      name="position"
                      value={form.values.position}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Location
                    </label>
                    <Select
                      name="location"
                      value={form.values.location}
                      onValueChange={(value) =>
                        form.setValue("location", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.values.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="hire_date"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Hire Date
                    </label>
                    <Input
                      id="hire_date"
                      name="hire_date"
                      type="date"
                      value={form.values.hire_date}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="salary"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Salary
                    </label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={form.values.salary}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addModal.closeModal()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Add Employee"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Employee Modal */}
      {editModal.isOpen && (
        <Dialog open={true} onOpenChange={() => editModal.closeModal()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update the employee details.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label
                      htmlFor="edit-name"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Full Name
                    </label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={form.values.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="edit-email"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Email Address
                    </label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={form.values.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-department"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Department
                    </label>
                    <Select
                      name="department"
                      value={form.values.department}
                      onValueChange={(value) =>
                        form.setValue("department", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="edit-position"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Position
                    </label>
                    <Input
                      id="edit-position"
                      name="position"
                      value={form.values.position}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-location"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Location
                    </label>
                    <Select
                      name="location"
                      value={form.values.location}
                      onValueChange={(value) =>
                        form.setValue("location", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="edit-phone"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="edit-phone"
                      name="phone"
                      value={form.values.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-hire_date"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Hire Date
                    </label>
                    <Input
                      id="edit-hire_date"
                      name="hire_date"
                      type="date"
                      value={form.values.hire_date}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-salary"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Salary
                    </label>
                    <Input
                      id="edit-salary"
                      name="salary"
                      type="number"
                      value={form.values.salary}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => editModal.closeModal()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Update Employee"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <Dialog open={true} onOpenChange={() => deleteModal.closeModal()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove {selectedEmployee?.name} from
                the directory? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => deleteModal.closeModal()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Deleting..." : "Delete Employee"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PageLayout>
  );
};

export default PeopleDirectory;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};
