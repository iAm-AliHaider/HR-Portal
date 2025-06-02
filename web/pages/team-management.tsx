import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";

// Team Management Interfaces
interface Team {
  id: string;
  name: string;
  description: string;
  team_lead: {
    name: string;
    email: string;
    position: string;
  };
  department: {
    name: string;
    description: string;
  };
  members: TeamMember[];
  projects: Project[];
  team_goals: TeamGoal[];
  performance_metrics: TeamPerformance;
  team_type: string;
  status: string;
  budget: number;
  max_members: number;
  created_at: string;
}

interface TeamMember {
  id: string;
  role: string;
  joined_at: string;
  permissions: string[];
  member: {
    name: string;
    email: string;
    position: string;
    phone: string;
  };
}

interface Project {
  id: string;
  name: string;
  status: string;
  priority: string;
}

interface TeamGoal {
  id: string;
  title: string;
  status: string;
  target_date: string;
}

interface TeamPerformance {
  productivity_score: number;
  collaboration_score: number;
  goal_completion_rate: number;
  member_satisfaction: number;
  project_success_rate: number;
}

const TeamManagementPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTeams();
  }, [currentPage]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/teams?page=${currentPage}&limit=10&orderBy=created_at&ascending=false`,
      );

      if (response.ok) {
        const data = await response.json();
        setTeams(generateMockTeams()); // Using mock data for demo
        setTotalCount(data.count || 25);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setTeams(generateMockTeams());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTeams = (): Team[] => [
    {
      id: "team_001",
      name: "Frontend Development Team",
      description:
        "Responsible for all user-facing applications and interfaces",
      team_lead: {
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        position: "Senior Frontend Developer",
      },
      department: {
        name: "Engineering",
        description: "Software Development",
      },
      members: [
        {
          id: "member_001",
          role: "Senior Developer",
          joined_at: "2023-01-15T00:00:00Z",
          permissions: ["read", "write", "review"],
          member: {
            name: "John Doe",
            email: "john.doe@company.com",
            position: "Frontend Developer",
            phone: "+1-555-0123",
          },
        },
        {
          id: "member_002",
          role: "Developer",
          joined_at: "2023-03-20T00:00:00Z",
          permissions: ["read", "write"],
          member: {
            name: "Emily Chen",
            email: "emily.chen@company.com",
            position: "Frontend Developer",
            phone: "+1-555-0124",
          },
        },
      ],
      projects: [
        {
          id: "proj_001",
          name: "Mobile App Redesign",
          status: "in_progress",
          priority: "high",
        },
        {
          id: "proj_002",
          name: "Dashboard Enhancement",
          status: "planning",
          priority: "medium",
        },
      ],
      team_goals: [
        {
          id: "goal_001",
          title: "Complete Mobile App Redesign",
          status: "in_progress",
          target_date: "2024-03-31T00:00:00Z",
        },
      ],
      performance_metrics: {
        productivity_score: 8.5,
        collaboration_score: 9.2,
        goal_completion_rate: 85,
        member_satisfaction: 8.8,
        project_success_rate: 92,
      },
      team_type: "development",
      status: "active",
      budget: 250000,
      max_members: 8,
      created_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "team_002",
      name: "Marketing Team",
      description: "Brand management and digital marketing initiatives",
      team_lead: {
        name: "Michael Rodriguez",
        email: "michael.rodriguez@company.com",
        position: "Marketing Manager",
      },
      department: {
        name: "Marketing",
        description: "Brand and Digital Marketing",
      },
      members: [
        {
          id: "member_003",
          role: "Content Specialist",
          joined_at: "2023-02-01T00:00:00Z",
          permissions: ["read", "write"],
          member: {
            name: "Lisa Wang",
            email: "lisa.wang@company.com",
            position: "Content Marketing Specialist",
            phone: "+1-555-0125",
          },
        },
      ],
      projects: [
        {
          id: "proj_003",
          name: "Q1 Campaign Launch",
          status: "completed",
          priority: "high",
        },
      ],
      team_goals: [
        {
          id: "goal_002",
          title: "Increase Brand Awareness by 30%",
          status: "on_track",
          target_date: "2024-06-30T00:00:00Z",
        },
      ],
      performance_metrics: {
        productivity_score: 8.1,
        collaboration_score: 8.7,
        goal_completion_rate: 78,
        member_satisfaction: 9.0,
        project_success_rate: 88,
      },
      team_type: "marketing",
      status: "active",
      budget: 180000,
      max_members: 6,
      created_at: "2023-01-15T00:00:00Z",
    },
  ];

  const createTeam = async (teamData: any) => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        const newTeam = await response.json();
        setTeams([newTeam, ...teams]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Failed to create team:", error);
    }
  };

  const addTeamMember = async (
    teamId: string,
    memberId: string,
    role: string,
  ) => {
    try {
      const response = await fetch("/api/teams?action=add-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, memberId, role }),
      });

      if (response.ok) {
        fetchTeams(); // Refresh teams
        setShowAddMemberModal(false);
      }
    } catch (error) {
      console.error("Failed to add team member:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      on_hold: "bg-yellow-100 text-yellow-800",
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors] || colors.active}`;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${colors[priority as keyof typeof colors] || colors.medium}`;
  };

  if (loading) {
    return (
      <Layout title="Team Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Team Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">👥 Team Management</h1>
              <p className="text-blue-100 mt-2">
                Manage teams, track performance, and optimize collaboration
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{teams.length}</div>
              <div className="text-sm text-blue-100">Active Teams</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teams.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Team Members
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teams.reduce((sum, team) => sum + team.members.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Avg Performance
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teams.length > 0
                    ? (
                        teams.reduce(
                          (sum, team) =>
                            sum + team.performance_metrics.productivity_score,
                          0,
                        ) / teams.length
                      ).toFixed(1)
                    : "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Projects
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teams.reduce((sum, team) => sum + team.projects.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ Create Team
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              📊 Performance Report
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search teams..."
              aria-label="Search teams"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              aria-label="Filter by department"
              title="Filter by department"
            >
              <option value="">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "performance", label: "Performance", icon: "📈" },
              { id: "members", label: "Members", icon: "👥" },
              { id: "projects", label: "Projects", icon: "🎯" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-6">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {team.name}
                          </h3>
                          <p className="text-gray-600">{team.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={getStatusBadge(team.status)}>
                          {team.status}
                        </span>
                        <button
                          onClick={() => setSelectedTeam(team)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Team Lead
                        </p>
                        <p className="text-gray-900">{team.team_lead.name}</p>
                        <p className="text-sm text-gray-500">
                          {team.team_lead.position}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Department
                        </p>
                        <p className="text-gray-900">{team.department.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Members
                        </p>
                        <p className="text-gray-900">
                          {team.members.length} / {team.max_members}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Performance Score
                        </p>
                        <p className="text-gray-900 font-semibold">
                          {team.performance_metrics.productivity_score}/10
                        </p>
                      </div>
                    </div>

                    {/* Team Projects */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Active Projects
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {team.projects.map((project) => (
                          <div
                            key={project.id}
                            className="flex items-center space-x-2"
                          >
                            <span className="text-sm text-gray-600">
                              {project.name}
                            </span>
                            <span
                              className={getPriorityBadge(project.priority)}
                            >
                              {project.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team Members Preview */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Team Members
                      </h4>
                      <div className="flex -space-x-2 overflow-hidden">
                        {team.members.slice(0, 5).map((member, index) => (
                          <div
                            key={member.id}
                            className="inline-block h-8 w-8 rounded-full bg-gray-300 ring-2 ring-white"
                            title={member.member.name}
                          >
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                              {member.member.name.charAt(0)}
                            </span>
                          </div>
                        ))}
                        {team.members.length > 5 && (
                          <div className="inline-block h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              +{team.members.length - 5}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * 10 + 1} to{" "}
                {Math.min(currentPage * 10, totalCount)} of {totalCount} teams
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage * 10 >= totalCount}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Team Performance Analytics
            </h2>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div key={team.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">
                          {team.name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {team.department.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Productivity:</span>
                          <span className="ml-2 font-medium">
                            {team.performance_metrics.productivity_score}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Collaboration:</span>
                          <span className="ml-2 font-medium">
                            {team.performance_metrics.collaboration_score}/10
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Goal Completion:
                          </span>
                          <span className="ml-2 font-medium">
                            {team.performance_metrics.goal_completion_rate}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Satisfaction:</span>
                          <span className="ml-2 font-medium">
                            {team.performance_metrics.member_satisfaction}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Department Comparison
                </h3>
                <div className="space-y-4">
                  {Array.from(new Set(teams.map((t) => t.department.name))).map(
                    (dept) => {
                      const deptTeams = teams.filter(
                        (t) => t.department.name === dept,
                      );
                      const avgScore =
                        deptTeams.reduce(
                          (sum, team) =>
                            sum + team.performance_metrics.productivity_score,
                          0,
                        ) / deptTeams.length;

                      return (
                        <div
                          key={dept}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{dept}</p>
                            <p className="text-sm text-gray-500">
                              {deptTeams.length} teams
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {avgScore.toFixed(1)}/10
                            </p>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(avgScore / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                👤 Add Member
              </button>
            </div>

            <div className="grid gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {team.name}
                  </h3>
                  <div className="grid gap-4">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {member.member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.member.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {member.member.position}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.member.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {member.role}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined:{" "}
                            {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Team Projects</h2>

            <div className="grid gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {team.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {team.projects.length} projects
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {team.projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {project.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {project.status}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={getPriorityBadge(project.priority)}>
                            {project.priority}
                          </span>
                          <span className={getStatusBadge(project.status)}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Team Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Team
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  createTeam({
                    name: formData.get("name"),
                    description: formData.get("description"),
                    team_type: formData.get("team_type"),
                    max_members: parseInt(
                      formData.get("max_members") as string,
                    ),
                    created_by: "current_user_id",
                  });
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Enter team name"
                      aria-label="Team name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Enter team description"
                      aria-label="Team description"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Type
                    </label>
                    <select
                      name="team_type"
                      aria-label="Team type"
                      title="Select team type"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="development">Development</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Members
                    </label>
                    <input
                      type="number"
                      name="max_members"
                      defaultValue={10}
                      min={1}
                      placeholder="Maximum team members"
                      aria-label="Maximum team members"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeamManagementPage;
