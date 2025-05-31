import React, { useState } from "react";

import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Wellness = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [wellnessGoals, setWellnessGoals] = useState([
    {
      id: 1,
      title: "Daily Steps",
      target: 10000,
      current: 7500,
      unit: "steps",
    },
    { id: 2, title: "Water Intake", target: 8, current: 5, unit: "glasses" },
    { id: 3, title: "Sleep Hours", target: 8, current: 6.5, unit: "hours" },
    { id: 4, title: "Meditation", target: 10, current: 7, unit: "minutes" },
  ]);

  const wellnessPrograms = [
    {
      id: 1,
      title: "Mental Health Support",
      description: "Access to counseling services and mental health resources",
      type: "Mental Health",
      participants: 245,
      status: "active",
      resources: [
        "Employee Assistance Program (EAP)",
        "Mental Health First Aid Training",
        "Stress Management Workshops",
        "Mindfulness Sessions",
      ],
    },
    {
      id: 2,
      title: "Fitness & Physical Wellness",
      description: "Gym memberships, fitness challenges, and health screenings",
      type: "Physical Health",
      participants: 189,
      status: "active",
      resources: [
        "Gym Membership Discounts",
        "On-site Fitness Classes",
        "Annual Health Screenings",
        "Ergonomic Assessments",
      ],
    },
    {
      id: 3,
      title: "Work-Life Balance",
      description: "Flexible working arrangements and time management support",
      type: "Work-Life Balance",
      participants: 312,
      status: "active",
      resources: [
        "Flexible Work Hours",
        "Remote Work Options",
        "Time Management Training",
        "Sabbatical Programs",
      ],
    },
    {
      id: 4,
      title: "Nutrition & Healthy Eating",
      description: "Nutrition counseling and healthy eating initiatives",
      type: "Nutrition",
      participants: 156,
      status: "active",
      resources: [
        "Nutrition Workshops",
        "Healthy Meal Options",
        "Cooking Classes",
        "Dietary Consultation",
      ],
    },
  ];

  const wellnessChallenges = [
    {
      id: 1,
      title: "30-Day Step Challenge",
      description: "Walk 10,000 steps daily for 30 days",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      participants: 89,
      prize: "Fitness Tracker",
      status: "active",
    },
    {
      id: 2,
      title: "Meditation Month",
      description: "Practice 10 minutes of meditation daily",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      participants: 67,
      prize: "Wellness Day Off",
      status: "active",
    },
    {
      id: 3,
      title: "Hydration Challenge",
      description: "Drink 8 glasses of water daily",
      startDate: "2024-06-15",
      endDate: "2024-07-15",
      participants: 112,
      prize: "Premium Water Bottle",
      status: "upcoming",
    },
  ];

  const mentalHealthResources = [
    {
      title: "Employee Assistance Program (EAP)",
      description: "24/7 confidential counseling and support services",
      contact: "1-800-HELP-NOW",
      type: "hotline",
    },
    {
      title: "Mental Health First Aid",
      description: "Training to recognize and respond to mental health issues",
      contact: "training@company.com",
      type: "training",
    },
    {
      title: "Stress Management Resources",
      description: "Tools and techniques for managing workplace stress",
      contact: "wellness@company.com",
      type: "resources",
    },
    {
      title: "Crisis Support",
      description: "Immediate support for mental health emergencies",
      contact: "911 or 1-800-CRISIS",
      type: "emergency",
    },
  ];

  const healthMetrics = [
    { label: "Wellness Program Participation", value: "78%", trend: "up" },
    { label: "Employee Satisfaction Score", value: "4.2/5", trend: "up" },
    { label: "Average Stress Level", value: "3.1/10", trend: "down" },
    { label: "Work-Life Balance Score", value: "3.8/5", trend: "up" },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Wellness Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {healthMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">{metric.label}</div>
              <div
                className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {metric.trend === "up" ? "↗ Improving" : "↘ Declining"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wellness Goals */}
      <Card>
        <CardHeader>
          <CardTitle>My Wellness Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wellnessGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{goal.title}</h3>
                  <span className="text-sm text-gray-600">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {Math.round((goal.current / goal.target) * 100)}% Complete
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Active Wellness Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wellnessChallenges
              .filter((c) => c.status === "active")
              .map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{challenge.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {challenge.description}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{challenge.participants} participants</span>
                    <span>Prize: {challenge.prize}</span>
                  </div>
                  <Button className="w-full mt-2" size="sm">
                    Join Challenge
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrograms = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wellnessPrograms.map((program) => (
          <Card
            key={program.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedProgram(program)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{program.title}</CardTitle>
              <div className="text-sm text-gray-600">{program.type}</div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{program.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {program.participants} participants
                </span>
                <Button size="sm">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedProgram.title}</h2>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-700 mb-4">{selectedProgram.description}</p>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Available Resources:</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedProgram.resources.map((resource, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Enroll Now</Button>
              <Button variant="outline" className="flex-1">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMentalHealth = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mental Health Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentalHealthResources.map((resource, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      resource.type === "emergency"
                        ? "bg-red-500"
                        : resource.type === "hotline"
                          ? "bg-orange-500"
                          : resource.type === "training"
                            ? "bg-blue-500"
                            : "bg-green-500"
                    }`}
                  ></div>
                  <h3 className="font-medium">{resource.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {resource.description}
                </p>
                <div className="text-sm font-medium text-blue-600">
                  {resource.contact}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Self-Assessment Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button className="w-full" variant="outline">
              Stress Level Assessment
            </Button>
            <Button className="w-full" variant="outline">
              Burnout Risk Evaluation
            </Button>
            <Button className="w-full" variant="outline">
              Work-Life Balance Check
            </Button>
            <Button className="w-full" variant="outline">
              Mental Health Screening
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wellnessChallenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <div
                className={`inline-block px-2 py-1 rounded text-xs ${
                  challenge.status === "active"
                    ? "bg-green-100 text-green-800"
                    : challenge.status === "upcoming"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {challenge.status.toUpperCase()}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{challenge.description}</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  Start: {new Date(challenge.startDate).toLocaleDateString()}
                </div>
                <div>
                  End: {new Date(challenge.endDate).toLocaleDateString()}
                </div>
                <div>Participants: {challenge.participants}</div>
                <div>Prize: {challenge.prize}</div>
              </div>
              <Button
                className="w-full mt-4"
                disabled={challenge.status !== "active"}
                size="sm"
              >
                {challenge.status === "active"
                  ? "Join Challenge"
                  : challenge.status === "upcoming"
                    ? "Coming Soon"
                    : "View Results"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <ModernDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Employee Wellness
          </h1>
          <p className="text-gray-600">
            Manage your health and well-being at work
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "programs", label: "Wellness Programs" },
            { id: "mental-health", label: "Mental Health" },
            { id: "challenges", label: "Challenges" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "programs" && renderPrograms()}
        {activeTab === "mental-health" && renderMentalHealth()}
        {activeTab === "challenges" && renderChallenges()}
      </div>
    </ModernDashboardLayout>
  );
};

export default Wellness;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
};
