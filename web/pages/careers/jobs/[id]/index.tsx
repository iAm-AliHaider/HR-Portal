import React, { useState, useEffect } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { GetServerSideProps } from "next";

import { supabase } from "../../../../lib/supabase/client";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary_range: string;
  company: string;
  benefits: string;
  closing_date: string;
  created_at: string;
}

// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default function JobDetailsPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const router = useRouter();
  const { id: jobId } = router.query;

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
      loadRelatedJobs();
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) {
        // Mock job data for development
        const mockJob: Job = {
          id: jobId as string,
          title: "Senior Software Engineer",
          department: "Engineering",
          location: "Remote",
          type: "Full-time",
          company: "Tech Company Inc.",
          description: `We are looking for a Senior Software Engineer to join our growing engineering team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.

In this role, you will work closely with product managers, designers, and other engineers to deliver high-quality software solutions that meet our customers' needs. You'll have the opportunity to work on challenging problems and contribute to the technical direction of our products.

We value innovation, collaboration, and continuous learning. This is an excellent opportunity for someone who wants to make a significant impact at a fast-growing company.`,
          requirements: `• Bachelor's degree in Computer Science or related field, or equivalent experience
• 5+ years of experience in software development
• Strong proficiency in JavaScript, TypeScript, React, and Node.js
• Experience with cloud platforms (AWS, GCP, or Azure)
• Knowledge of database systems (PostgreSQL, MongoDB)
• Familiarity with CI/CD pipelines and DevOps practices
• Strong problem-solving and communication skills
• Experience with agile development methodologies
• Passion for writing clean, maintainable code`,
          benefits: `• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements (remote-first culture)
• Generous PTO and holidays
• Professional development budget ($2,000/year)
• Home office setup allowance
• Team retreats and company events
• 401(k) with company matching
• Mental health and wellness support`,
          salary_range: "$120,000 - $150,000",
          closing_date: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          created_at: new Date().toISOString(),
        };
        setJob(mockJob);
      } else {
        setJob(data);
      }
    } catch (error) {
      console.error("Error loading job:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedJobs = async () => {
    // Mock related jobs for development
    const mockRelatedJobs: Job[] = [
      {
        id: "2",
        title: "Frontend Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        company: "Tech Company Inc.",
        description: "Join our frontend team...",
        requirements: "React, TypeScript experience...",
        benefits: "Great benefits...",
        salary_range: "$90,000 - $120,000",
        closing_date: new Date(
          Date.now() + 25 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        title: "DevOps Engineer",
        department: "Engineering",
        location: "San Francisco",
        type: "Full-time",
        company: "Tech Company Inc.",
        description: "Help us scale our infrastructure...",
        requirements: "AWS, Kubernetes experience...",
        benefits: "Excellent benefits...",
        salary_range: "$110,000 - $140,000",
        closing_date: new Date(
          Date.now() + 20 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        created_at: new Date().toISOString(),
      },
    ];

    setRelatedJobs(mockRelatedJobs);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntilClosing = (closingDate: string) => {
    const today = new Date();
    const closing = new Date(closingDate);
    const timeDiff = closing.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job you're looking for could not be found.
          </p>
          <Link
            href="/careers"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilClosing = getDaysUntilClosing(job.closing_date);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{job.title} | Job Details</title>
        <meta name="description" content={job.description} />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                href="/careers"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 mr-4"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Jobs
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/candidate/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/candidate/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Join Us
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {job.department}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {job.type}
                    </span>
                    <span className="flex items-center text-green-600 font-medium">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      {job.salary_range}
                    </span>
                  </div>
                  <p className="text-gray-600">{job.company}</p>
                </div>

                <div className="mt-4 md:mt-0 md:ml-6">
                  <Link
                    href={`/careers/jobs/${job.id}/apply`}
                    className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-center block"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>

              {daysUntilClosing > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-yellow-800">
                      Application deadline: {formatDate(job.closing_date)} (
                      {daysUntilClosing} days remaining)
                    </span>
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Posted on {formatDate(job.created_at)}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Role
              </h2>
              <div className="prose prose-gray max-w-none">
                {job.description.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Requirements
              </h2>
              <div className="text-gray-700">
                {job.requirements.split("\n").map((requirement, index) => (
                  <div key={index} className="mb-2">
                    {requirement.trim() && (
                      <div className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{requirement.replace("•", "").trim()}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Benefits & Perks
                </h2>
                <div className="text-gray-700">
                  {job.benefits.split("\n").map((benefit, index) => (
                    <div key={index} className="mb-2">
                      {benefit.trim() && (
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>{benefit.replace("•", "").trim()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ready to Apply?
              </h3>
              <p className="text-gray-600 mb-4">
                Join our team and make an impact at a growing company.
              </p>
              <Link
                href={`/careers/jobs/${job.id}/apply`}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 text-center block"
              >
                Apply for This Position
              </Link>
              <div className="mt-4 text-center">
                <Link
                  href="/candidate/register"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Share This Job
              </h3>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                  LinkedIn
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700">
                  Copy Link
                </button>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                About {job.company}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                We're a fast-growing technology company building innovative
                solutions for modern businesses. Join our team of talented
                professionals and help shape the future of technology.
              </p>
              <Link
                href="/careers"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                View All Open Positions →
              </Link>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Similar Positions
                </h3>
                <div className="space-y-4">
                  {relatedJobs.map((relatedJob) => (
                    <div
                      key={relatedJob.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <Link href={`/careers/jobs/${relatedJob.id}`}>
                        <h4 className="font-medium text-gray-900 hover:text-blue-600">
                          {relatedJob.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {relatedJob.location} • {relatedJob.type}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          {relatedJob.salary_range}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
