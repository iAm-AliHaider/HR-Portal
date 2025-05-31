// @ts-nocheck
import React, { useState, useEffect } from "react";

import {
  format,
  isAfter,
  parseISO,
  addDays,
  addWeeks,
  addMonths,
} from "date-fns";
import { GetServerSideProps } from "next";

import ModernDashboardLayout from "@/components/layout/ModernDashboardLayout";
import { useTasks, TaskFilter } from "@/hooks/useTasks";
import { fetchUsers, getTaskCategories } from "@/services/tasks";

import { Task, TaskChecklistItem, Project } from "../../packages/types";

const TaskPriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
  const getColor = () => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${getColor()}`}>
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }: { status: Task["status"] }) => {
  const getColor = () => {
    switch (status) {
      case "Todo":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${getColor()}`}>
      {status}
    </span>
  );
};

// Component for showing task dependencies
const TaskDependencies = ({ task, getTaskById, getSubtasks }) => {
  const [subtasks, setSubtasks] = useState([]);
  const [parentTask, setParentTask] = useState(null);

  useEffect(() => {
    // Get subtasks
    const childTasks = getSubtasks(task.id);
    setSubtasks(childTasks);

    // Get parent task if exists
    if (task.parent_task_id) {
      getTaskById(task.parent_task_id).then((parent) => {
        setParentTask(parent);
      });
    }
  }, [task, getTaskById, getSubtasks]);

  if (!parentTask && subtasks.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Task Dependencies
      </h4>
      {parentTask && (
        <div className="mb-2">
          <h5 className="text-xs text-gray-500">Parent Task:</h5>
          <div
            className="p-2 border rounded mt-1 text-sm hover:bg-gray-50 cursor-pointer"
            onClick={() => getTaskById(parentTask.id)}
          >
            {parentTask.title}
          </div>
        </div>
      )}
      {subtasks.length > 0 && (
        <div>
          <h5 className="text-xs text-gray-500">Subtasks:</h5>
          <div className="space-y-1 mt-1">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="p-2 border rounded text-sm hover:bg-gray-50 cursor-pointer flex items-center"
                onClick={() => getTaskById(subtask.id)}
              >
                {subtask.status === "Completed" && (
                  <span className="mr-2 text-green-500">✓</span>
                )}
                {subtask.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Component for Time Tracking
const TimeTracking = ({ task, logTaskTime }) => {
  const [timeToLog, setTimeToLog] = useState("");

  const handleLogTime = (e) => {
    e.preventDefault();
    const hours = parseFloat(timeToLog);
    if (isNaN(hours) || hours <= 0) return;

    logTaskTime(task.id, hours);
    setTimeToLog("");
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Time Tracking</h4>
      <div className="flex items-center text-sm mb-2">
        <span className="text-gray-500 mr-2">Estimated:</span>
        <span>{task.estimated_hours || 0} hours</span>
      </div>
      <div className="flex items-center text-sm mb-3">
        <span className="text-gray-500 mr-2">Actual:</span>
        <span>{task.actual_hours || 0} hours</span>
      </div>
      <form onSubmit={handleLogTime} className="flex items-center">
        <input
          type="number"
          min="0.1"
          step="0.1"
          className="border rounded px-2 py-1 text-sm mr-2 w-20"
          placeholder="Hours"
          value={timeToLog}
          onChange={(e) => setTimeToLog(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-3 py-1 text-sm"
          disabled={!timeToLog}
        >
          Log Time
        </button>
      </form>
    </div>
  );
};

// Component for Recurrence Pattern
const RecurrencePattern = ({ task, createRecurringTask }) => {
  const [isRecurringTask, setIsRecurringTask] = useState(!!task.is_recurring);
  const [recurrencePattern, setRecurrencePattern] = useState(
    task.recurrence_pattern || "weekly",
  );
  const [endDate, setEndDate] = useState(task.recurrence_end_date || "");

  const getRecurrenceText = () => {
    if (!task.is_recurring) return "Not recurring";

    let text = `Repeats ${task.recurrence_pattern}`;
    if (task.recurrence_end_date) {
      text += ` until ${format(parseISO(task.recurrence_end_date), "MMM d, yyyy")}`;
    }
    return text;
  };

  const handleCreateNextOccurrence = async () => {
    if (!task.is_recurring) return;

    let nextDueDate;
    const currentDueDate = parseISO(task.due_date);

    switch (task.recurrence_pattern) {
      case "daily":
        nextDueDate = addDays(currentDueDate, 1);
        break;
      case "weekly":
        nextDueDate = addWeeks(currentDueDate, 1);
        break;
      case "monthly":
        nextDueDate = addMonths(currentDueDate, 1);
        break;
      default:
        nextDueDate = addDays(currentDueDate, 1);
    }

    // Check if we've reached the end date
    if (
      task.recurrence_end_date &&
      isAfter(nextDueDate, parseISO(task.recurrence_end_date))
    ) {
      return; // Don't create more if we've passed the end date
    }

    // Create next occurrence
    const { id, created_at, updated_at, completed_at, ...taskData } = task;

    await createRecurringTask(
      {
        ...taskData,
        status: "Todo",
        due_date: nextDueDate.toISOString(),
      },
      task.recurrence_pattern,
      task.recurrence_end_date,
    );
  };

  if (task.status === "Completed" && task.is_recurring) {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          Recurring Task
        </h4>
        <p className="text-sm text-blue-600 mb-2">{getRecurrenceText()}</p>
        <button
          onClick={handleCreateNextOccurrence}
          className="bg-blue-500 text-white rounded px-3 py-1 text-sm"
        >
          Create Next Occurrence
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Recurrence</h4>
      {task.is_recurring ? (
        <div className="text-sm text-gray-600">{getRecurrenceText()}</div>
      ) : (
        <div className="text-sm text-gray-500">Not a recurring task</div>
      )}
    </div>
  );
};

// Component for Team and Project selection
const TeamProjectSelector = ({ task, teams, projects, editTask }) => {
  const [selectedTeam, setSelectedTeam] = useState(task.team_id || "");
  const [selectedProject, setSelectedProject] = useState(task.project_id || "");

  const handleTeamChange = async (e) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);
    await editTask(task.id, { team_id: teamId || null });
  };

  const handleProjectChange = async (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    await editTask(task.id, { project_id: projectId || null });
  };

  return (
    <div className="mt-4 space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Team
        </label>
        <select
          className="w-full border rounded px-3 py-1.5 text-sm"
          value={selectedTeam}
          onChange={handleTeamChange}
        >
          <option value="">None</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project
        </label>
        <select
          className="w-full border rounded px-3 py-1.5 text-sm"
          value={selectedProject}
          onChange={handleProjectChange}
        >
          <option value="">None</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const TasksList = () => {
  // State and hooks
  const {
    filteredTasks,
    selectedTask,
    loading,
    error,
    filter,
    setFilter,
    setSelectedTask,
    getTaskById,
    addTask,
    editTask,
    removeTask,
    addComment,
    addChecklistItem,
    updateChecklistItem,
    completeTask,
    isOverdue,
    teams,
    projects,
    createCalendarEventFromTask,
    createRecurringTask,
    createSubtask,
    getSubtasks,
    addTaskWatcher,
    removeTaskWatcher,
    logTaskTime,
    loadTasks,
  } = useTasks({ showCompleted: true });

  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
    due_date: new Date(Date.now() + 86400000 * 7).toISOString(), // Default to 1 week from now
  });
  const [commentText, setCommentText] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "list">("list");
  const [searchText, setSearchText] = useState("");

  // Fetch users and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchUsers();
        setUsers(userData);
        setCategories(getTaskCategories());
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    };
    loadData();
  }, []);

  // Apply search filter
  useEffect(() => {
    setFilter((prev) => ({ ...prev, search: searchText }));
  }, [searchText, setFilter]);

  // Form handlers
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.due_date) return;

    await addTask({
      ...(newTask as Omit<Task, "id" | "created_at" | "updated_at">),
      org_id: "org1", // This would normally come from context or auth
    });
    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      status: "Todo",
      due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
    });
    setShowAddTask(false);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedTask) return;
    await addComment(selectedTask.id, {
      task_id: selectedTask.id,
      user_id: "user1", // This would normally come from auth
      content: commentText,
    });
    setCommentText("");
  };

  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.trim() || !selectedTask) return;
    await addChecklistItem(selectedTask.id, {
      content: newChecklistItem,
      completed: false,
    });
    setNewChecklistItem("");
  };

  const handleToggleChecklistItem = async (
    taskId: string,
    itemId: string,
    completed: boolean,
  ) => {
    const updates: Partial<TaskChecklistItem> = {
      completed,
    };
    if (completed) {
      updates.completed_at = new Date().toISOString();
      updates.completed_by = "user1"; // This would normally come from auth
    } else {
      updates.completed_at = undefined;
      updates.completed_by = undefined;
    }
    await updateChecklistItem(taskId, itemId, updates);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await removeTask(taskId);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (err) {
      return dateString;
    }
  };

  // Calculate progress for a task
  const calculateProgress = (task: Task): number => {
    if (!task.checklist || task.checklist.length === 0) {
      return task.status === "Completed" ? 100 : 0;
    }

    const completedItems = task.checklist.filter(
      (item) => item.completed,
    ).length;
    return Math.round((completedItems / task.checklist.length) * 100);
  };

  // Group tasks by status for board view
  const groupedTasks = filteredTasks.reduce<Record<Task["status"], Task[]>>(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    },
    { Todo: [], "In Progress": [], "On Hold": [], Completed: [] },
  );

  // Render task list view
  const renderTaskList = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </th>
            <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredTasks.map((task) => {
            const progress = calculateProgress(task);
            const isTaskOverdue =
              isOverdue(task.due_date) && task.status !== "Completed";

            return (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {task.title}
                    </span>
                    {task.description && (
                      <span className="text-sm text-gray-500 line-clamp-1">
                        {task.description}
                      </span>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <StatusBadge status={task.status} />
                </td>
                <td className="py-4 px-4">
                  <TaskPriorityBadge priority={task.priority} />
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`text-sm ${isTaskOverdue ? "text-red-600 font-medium" : "text-gray-700"}`}
                  >
                    {formatDate(task.due_date)}
                    {isTaskOverdue && " (Overdue)"}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        progress === 100 ? "bg-green-600" : "bg-blue-600"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {progress}%
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => getTaskById(task.id)}
                    >
                      Details
                    </button>
                    {task.status !== "Completed" && (
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => completeTask(task.id)}
                      >
                        Complete
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Render task board view (kanban style)
  const renderTaskBoard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {(
        ["Todo", "In Progress", "On Hold", "Completed"] as Task["status"][]
      ).map((status) => (
        <div key={status} className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-700 mb-4 flex justify-between items-center">
            {status}{" "}
            <span className="text-gray-500 text-sm">
              {groupedTasks[status].length}
            </span>
          </h3>
          <div className="space-y-3">
            {groupedTasks[status].map((task) => {
              const progress = calculateProgress(task);
              const isTaskOverdue =
                isOverdue(task.due_date) && task.status !== "Completed";

              return (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => getTaskById(task.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <TaskPriorityBadge priority={task.priority} />
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span>Due: {formatDate(task.due_date)}</span>
                    {isTaskOverdue && (
                      <span className="text-red-600 font-medium">Overdue!</span>
                    )}
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 mb-3">
                      {task.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {task.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{task.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div
                      className={`h-1.5 rounded-full ${
                        progress === 100 ? "bg-green-600" : "bg-blue-600"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {progress}% completed
                    </span>
                    {task.checklist && (
                      <span className="text-xs text-gray-500">
                        {task.checklist.filter((item) => item.completed).length}
                        /{task.checklist.length} items
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // Render filters
  const renderFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filter.showCompleted ? "all" : "active"}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                showCompleted: e.target.value === "all",
              }))
            }
          >
            <option value="all">All Tasks</option>
            <option value="active">Active Only</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={
              filter.priority && filter.priority.length === 1
                ? filter.priority[0]
                : ""
            }
            onChange={(e) => {
              const value = e.target.value as Task["priority"] | "";
              setFilter((prev) => ({
                ...prev,
                priority: value ? [value] : undefined,
              }));
            }}
          >
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="flex bg-gray-100 rounded-md">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-l-md ${viewMode === "list" ? "bg-blue-100 text-blue-700" : ""}`}
              aria-label="List view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`p-2 rounded-r-md ${viewMode === "board" ? "bg-blue-100 text-blue-700" : ""}`}
              aria-label="Board view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render task detail modal
  const renderTaskDetail = () => {
    if (!selectedTask) return null;

    const progress = calculateProgress(selectedTask);
    const taskIsOverdue =
      isOverdue(selectedTask.due_date) && selectedTask.status !== "Completed";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTask.title}
                </h2>
                <div className="flex items-center mt-1 space-x-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Status:</span>
                    <StatusBadge status={selectedTask.status} />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      Priority:
                    </span>
                    <TaskPriorityBadge priority={selectedTask.priority} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedTask.description || "No description provided."}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Checklist
                  </h3>
                  {selectedTask.checklist &&
                  selectedTask.checklist.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTask.checklist.map((item) => (
                        <div key={item.id} className="flex items-start">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={(e) =>
                              handleToggleChecklistItem(
                                selectedTask.id,
                                item.id,
                                e.target.checked,
                              )
                            }
                            className="mt-1 mr-2"
                          />
                          <div className="flex-1">
                            <p
                              className={`${item.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                            >
                              {item.content}
                            </p>
                            {item.completed && item.completed_at && (
                              <p className="text-xs text-gray-400">
                                Completed {formatDate(item.completed_at)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No checklist items yet.
                    </p>
                  )}
                  <div className="mt-3 flex">
                    <input
                      type="text"
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      placeholder="Add new item..."
                      className="flex-1 border rounded-l px-3 py-1.5 text-sm"
                    />
                    <button
                      onClick={handleAddChecklistItem}
                      disabled={!newChecklistItem.trim()}
                      className="bg-blue-500 text-white rounded-r px-3 py-1.5 text-sm disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </h3>
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTask.comments.map((comment) => {
                        const user = users.find(
                          (u) => u.id === comment.user_id,
                        ) || { full_name: "Unknown User" };
                        return (
                          <div
                            key={comment.id}
                            className="bg-gray-50 p-3 rounded"
                          >
                            <div className="flex items-center mb-1">
                              <span className="font-medium text-sm">
                                {user.full_name}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">
                              {comment.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No comments yet.</p>
                  )}
                  <div className="mt-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full border rounded px-3 py-2 text-sm h-20"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                        className="bg-blue-500 text-white rounded px-4 py-1.5 text-sm disabled:opacity-50"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>

                <TaskDependencies
                  task={selectedTask}
                  getTaskById={getTaskById}
                  getSubtasks={getSubtasks}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">Due Date</div>
                      <div
                        className={`text-sm ${taskIsOverdue ? "text-red-600 font-medium" : "text-gray-900"}`}
                      >
                        {formatDate(selectedTask.due_date)}
                        {taskIsOverdue && " (Overdue)"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Category</div>
                      <div className="text-sm text-gray-900">
                        {selectedTask.category || "Uncategorized"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Assigned To</div>
                      <div className="text-sm text-gray-900">
                        {users.find((u) => u.id === selectedTask.assigned_to)
                          ?.full_name || "Unassigned"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {progress}% complete
                      </div>
                    </div>
                    {selectedTask.tags && selectedTask.tags.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-500">Tags</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTask.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <TeamProjectSelector
                  task={selectedTask}
                  teams={teams}
                  projects={projects}
                  editTask={editTask}
                />

                <TimeTracking task={selectedTask} logTaskTime={logTaskTime} />

                <RecurrencePattern
                  task={selectedTask}
                  createRecurringTask={createRecurringTask}
                />

                <div className="space-y-2">
                  <button
                    onClick={() => createCalendarEventFromTask(selectedTask.id)}
                    className="w-full bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600"
                  >
                    Add to Calendar
                  </button>

                  {selectedTask.status !== "Completed" ? (
                    <button
                      onClick={() => completeTask(selectedTask.id)}
                      className="w-full bg-green-500 text-white rounded px-4 py-2 text-sm hover:bg-green-600"
                    >
                      Mark as Completed
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        editTask(selectedTask.id, {
                          status: "Todo",
                          completed_at: undefined,
                        })
                      }
                      className="w-full bg-yellow-500 text-white rounded px-4 py-2 text-sm hover:bg-yellow-600"
                    >
                      Reopen Task
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    className="w-full bg-red-500 text-white rounded px-4 py-2 text-sm hover:bg-red-600"
                  >
                    Delete Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render add task form
  const renderAddTaskForm = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Task
              </h2>
              <button
                onClick={() => setShowAddTask(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border rounded px-3 py-2 text-sm h-24"
                    value={newTask.description || ""}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={
                        newTask.due_date
                          ? format(new Date(newTask.due_date), "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          due_date: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : "",
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={newTask.estimated_hours || ""}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          estimated_hours: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={newTask.category || ""}
                      onChange={(e) =>
                        setNewTask({ ...newTask, category: e.target.value })
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={newTask.team_id || ""}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          team_id: e.target.value || undefined,
                        })
                      }
                    >
                      <option value="">None</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={newTask.project_id || ""}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          project_id: e.target.value || undefined,
                        })
                      }
                    >
                      <option value="">None</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned To
                    </label>
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={newTask.assigned_to || ""}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          assigned_to: e.target.value || undefined,
                        })
                      }
                    >
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Enter tags separated by commas"
                    value={newTask.tags ? newTask.tags.join(", ") : ""}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        tags: e.target.value
                          ? e.target.value.split(",").map((tag) => tag.trim())
                          : undefined,
                      })
                    }
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    className="mr-2"
                    checked={!!newTask.is_recurring}
                    onChange={(e) =>
                      setNewTask({ ...newTask, is_recurring: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="isRecurring"
                    className="text-sm text-gray-700"
                  >
                    Recurring Task
                  </label>
                </div>

                {newTask.is_recurring && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recurrence Pattern
                      </label>
                      <select
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={newTask.recurrence_pattern || "weekly"}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            recurrence_pattern: e.target.value,
                          })
                        }
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={
                          newTask.recurrence_end_date
                            ? format(
                                new Date(newTask.recurrence_end_date),
                                "yyyy-MM-dd",
                              )
                            : ""
                        }
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            recurrence_end_date: e.target.value
                              ? new Date(e.target.value).toISOString()
                              : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="border border-gray-300 bg-white text-gray-700 rounded px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 text-sm disabled:opacity-50"
                    disabled={!newTask.title || !newTask.due_date}
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500">Manage and track your tasks</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode(viewMode === "list" ? "board" : "list")}
            className="border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium text-gray-700"
          >
            {viewMode === "list" ? "Board View" : "List View"}
          </button>
          <button
            onClick={() => setShowAddTask(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Task
          </button>
        </div>
      </div>

      {renderFilters()}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-md flex flex-col items-center">
          <p className="font-semibold mb-2">Error loading tasks:</p>
          <p className="mb-4">{error.message}</p>
          <button
            onClick={() => loadTasks()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
          <p className="mt-4 text-sm text-red-600">
            If the error persists, please check your network connection and make
            sure the API is accessible.
          </p>
        </div>
      ) : (
        <>{viewMode === "list" ? renderTaskList() : renderTaskBoard()}</>
      )}

      {showAddTask && renderAddTaskForm()}
      {selectedTask && renderTaskDetail()}
    </div>
  );
};

const TasksPage = () => {
  return (
    <ModernDashboardLayout>
      <TasksList />
    </ModernDashboardLayout>
  );
};

export default TasksPage;

// Force server-side rendering to prevent SSR issues
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      timestamp: new Date().toISOString(),
    },
  };
};
