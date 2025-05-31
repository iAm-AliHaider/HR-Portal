import { useState, useEffect } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { ModernRequireRole } from "@/components/ModernRequireRole";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useJob, useToast, useForm } from "@/hooks/useApi";

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function EditJobPage() {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  // API hooks
  const { job, loading, error, refetch } = useJob(id as string);

  // Form state
  const form = useForm({
    title: "",
    department: "",
    location: "",
    type: "",
    salary_range: "",
    description: "",
    requirements: "",
    benefits: "",
    closing_date: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Departments and job types lists
  const departments = [
    "Engineering",
    "HR",
    "Marketing",
    "Finance",
    "Sales",
    "Design",
    "Support",
  ];
  const locations = [
    "New York",
    "San Francisco",
    "Chicago",
    "Remote",
    "Los Angeles",
  ];
  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
  ];

  // Load job data into form
  useEffect(() => {
    if (job) {
      form.setValue("title", job.title || "");
      form.setValue("department", job.department || "");
      form.setValue("location", job.location || "");
      form.setValue("type", job.type || "");
      form.setValue("salary_range", job.salary_range || "");
      form.setValue("description", job.description || "");
      form.setValue("requirements", job.requirements || "");
      form.setValue("benefits", job.benefits || "");
      form.setValue(
        "closing_date",
        job.closing_date
          ? new Date(job.closing_date).toISOString().split("T")[0]
          : "",
      );
    }
  }, [job]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let hasErrors = false;

    if (!form.values.title) {
      form.setError("title", "Job title is required");
      hasErrors = true;
    }

    if (!form.values.department) {
      form.setError("department", "Department is required");
      hasErrors = true;
    }

    if (!form.values.description) {
      form.setError("description", "Job description is required");
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);

    try {
      // In real implementation, this would call the updateJob method from useJobs hook
      // const { updateJob } = useJobs();
      // await updateJob(id as string, form.values);

      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Job updated successfully");
      router.push(`/jobs/${id}`);
    } catch (error) {
      toast.error("Failed to update job");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <ModernRequireRole
        allowed={["admin", "hr", "recruiter"]}
        fallbackToPublic={true}
      >
        <ModernDashboardLayout>
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </ModernDashboardLayout>
      </ModernRequireRole>
    );
  }

  // Error state
  if (error) {
    return (
      <ModernRequireRole
        allowed={["admin", "hr", "recruiter"]}
        fallbackToPublic={true}
      >
        <ModernDashboardLayout>
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Error Loading Job</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </ModernDashboardLayout>
      </ModernRequireRole>
    );
  }

  // Not found state
  if (!job) {
    return (
      <ModernRequireRole
        allowed={["admin", "hr", "recruiter"]}
        fallbackToPublic={true}
      >
        <ModernDashboardLayout>
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
            <p className="text-gray-600 mb-6">
              The job you're trying to edit doesn't exist or has been removed.
            </p>
            <Link href="/jobs">
              <Button>Back to Jobs</Button>
            </Link>
          </div>
        </ModernDashboardLayout>
      </ModernRequireRole>
    );
  }

  return (
    <ModernRequireRole
      allowed={["admin", "hr", "recruiter"]}
      fallbackToPublic={true}
    >
      <Head>
        <title>Edit Job | HR Portal</title>
        <meta name="description" content="Edit job posting" />
      </Head>

      <ModernDashboardLayout title="Edit Job" subtitle={job.title}>
        <div className="max-w-5xl mx-auto">
          <Card className="w-full">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        className={`w-full border ${form.errors.title ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                        placeholder="e.g. Senior Software Engineer"
                        value={form.values.title}
                        onChange={(e) => form.setValue("title", e.target.value)}
                      />
                      {form.errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {form.errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department *
                      </label>
                      <select
                        className={`w-full border ${form.errors.department ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2`}
                        value={form.values.department}
                        onChange={(e) =>
                          form.setValue("department", e.target.value)
                        }
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {form.errors.department && (
                        <p className="mt-1 text-sm text-red-600">
                          {form.errors.department}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={form.values.location}
                        onChange={(e) =>
                          form.setValue("location", e.target.value)
                        }
                      >
                        <option value="">Select Location</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Type
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={form.values.type}
                        onChange={(e) => form.setValue("type", e.target.value)}
                      >
                        <option value="">Select Job Type</option>
                        {jobTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g. $80,000 - $100,000"
                        value={form.values.salary_range}
                        onChange={(e) =>
                          form.setValue("salary_range", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Closing Date
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={form.values.closing_date}
                        onChange={(e) =>
                          form.setValue("closing_date", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Job Description</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      className={`w-full border ${form.errors.description ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 h-32`}
                      placeholder="Provide a detailed description of the job"
                      value={form.values.description}
                      onChange={(e) =>
                        form.setValue("description", e.target.value)
                      }
                    ></textarea>
                    {form.errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {form.errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                      placeholder="List the requirements for this job"
                      value={form.values.requirements}
                      onChange={(e) =>
                        form.setValue("requirements", e.target.value)
                      }
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                      You can use HTML for formatting. List items will be
                      displayed as bullet points.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Benefits
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                      placeholder="List the benefits offered with this job"
                      value={form.values.benefits}
                      onChange={(e) =>
                        form.setValue("benefits", e.target.value)
                      }
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                      You can use HTML for formatting. List items will be
                      displayed as bullet points.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Link href={`/jobs/${id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <div className="space-x-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </ModernDashboardLayout>
    </ModernRequireRole>
  );
}
