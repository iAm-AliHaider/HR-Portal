import { createClient } from "@supabase/supabase-js";
import {
  Task,
  TaskComment,
  TaskAttachment,
  TaskChecklistItem,
} from "../../packages/types";
import { v4 as uuidv4 } from "uuid";

// Mock data for development
const mockUsers = [
  {
    id: "user1",
    full_name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john.jpg",
  },
  {
    id: "user2",
    full_name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/avatars/jane.jpg",
  },
  {
    id: "user3",
    full_name: "Robert Johnson",
    email: "robert@example.com",
    avatar: "/avatars/robert.jpg",
  },
  {
    id: "user4",
    full_name: "Emily Davis",
    email: "emily@example.com",
    avatar: "/avatars/emily.jpg",
  },
];

const mockTasks: Task[] = [
  {
    id: "task1",
    org_id: "org1",
    title: "Complete quarterly performance review",
    description:
      "Review team performance metrics and prepare summary for executive meeting",
    due_date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    priority: "High",
    status: "In Progress",
    assigned_to: "user1",
    assigned_by: "user3",
    category: "HR",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ["performance", "quarterly", "review"],
    team_id: "team2",
    project_id: "project2",
    estimated_hours: 8,
    actual_hours: 3.5,
    watchers: ["user2", "user3"],
    comments: [
      {
        id: "comment1",
        task_id: "task1",
        user_id: "user3",
        content: "Please make sure to include all the new hires from Q2",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    checklist: [
      {
        id: "check1",
        content: "Gather team metrics",
        completed: true,
        completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        completed_by: "user1",
      },
      {
        id: "check2",
        content: "Review individual performance",
        completed: false,
      },
      {
        id: "check3",
        content: "Prepare presentation",
        completed: false,
      },
    ],
  },
  {
    id: "task2",
    org_id: "org1",
    title: "Update employee handbook",
    description:
      "Incorporate new remote work policy into the employee handbook",
    due_date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    priority: "Medium",
    status: "Todo",
    assigned_to: "user2",
    assigned_by: "user3",
    category: "Documentation",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ["policy", "handbook", "remote-work"],
    team_id: "team2",
    estimated_hours: 12,
    actual_hours: 0,
  },
  {
    id: "task3",
    org_id: "org1",
    title: "Prepare new hire onboarding package",
    description:
      "Create welcome package for new developers starting next month",
    due_date: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
    priority: "Medium",
    status: "Todo",
    assigned_to: "user4",
    assigned_by: "user1",
    category: "Onboarding",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ["onboarding", "welcome", "new-hires"],
    team_id: "team2",
    project_id: "project3",
    estimated_hours: 6,
  },
  {
    id: "task4",
    org_id: "org1",
    title: "Schedule team building event",
    description:
      "Plan and schedule a team building activity for the engineering department",
    due_date: new Date(Date.now() + 86400000 * 21).toISOString(), // 21 days from now
    priority: "Low",
    status: "Todo",
    assigned_to: "user2",
    assigned_by: "user3",
    category: "Events",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ["team-building", "event"],
    team_id: "team1",
    estimated_hours: 4,
  },
  {
    id: "task5",
    org_id: "org1",
    title: "Review and approve expense reports",
    description:
      "Review and process expense reports for the marketing department",
    due_date: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    priority: "High",
    status: "Todo",
    assigned_to: "user1",
    assigned_by: "user3",
    category: "Finance",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ["expenses", "approval", "finance"],
    project_id: "project4",
    estimated_hours: 2,
    actual_hours: 0.5,
  },
  {
    id: "task6",
    org_id: "org1",
    title: "Complete annual compliance training",
    description: "Finish required compliance training modules",
    due_date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago (overdue)
    priority: "Urgent",
    status: "Todo",
    assigned_to: "user4",
    assigned_by: "user3",
    category: "Compliance",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    tags: ["compliance", "training", "required"],
    is_recurring: true,
    recurrence_pattern: "yearly",
    recurrence_end_date: new Date(
      Date.now() + 86400000 * 365 * 3,
    ).toISOString(), // 3 years from now
    estimated_hours: 5,
  },
  {
    id: "task7",
    org_id: "org1",
    title: "Send client satisfaction survey",
    description:
      "Create and distribute satisfaction survey to all active clients",
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    priority: "Medium",
    status: "Completed",
    assigned_to: "user2",
    assigned_by: "user1",
    category: "Client Relations",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: new Date(Date.now() - 86400000).toISOString(),
    tags: ["survey", "client", "satisfaction"],
    project_id: "project1",
    team_id: "team1",
    estimated_hours: 3,
    actual_hours: 2.5,
  },
  {
    id: "task8",
    org_id: "org1",
    title: "Weekly team status update",
    description:
      "Prepare and distribute weekly team status updates to stakeholders",
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    priority: "Medium",
    status: "Todo",
    assigned_to: "user1",
    assigned_by: "user1",
    category: "Reporting",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["reporting", "status", "weekly"],
    team_id: "team1",
    is_recurring: true,
    recurrence_pattern: "weekly",
    estimated_hours: 1,
    actual_hours: 0,
  },
  {
    id: "task9",
    org_id: "org1",
    title: "Update website content",
    description:
      "Review and update the company website content for accuracy and relevance",
    due_date: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
    priority: "Low",
    status: "In Progress",
    assigned_to: "user3",
    assigned_by: "user2",
    category: "Marketing",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    tags: ["website", "content", "marketing"],
    project_id: "project1",
    parent_task_id: "task10",
    estimated_hours: 6,
    actual_hours: 2,
    checklist: [
      {
        id: "check4",
        content: "Review current content",
        completed: true,
        completed_at: new Date(Date.now() - 86400000).toISOString(),
        completed_by: "user3",
      },
      {
        id: "check5",
        content: "Identify outdated information",
        completed: true,
        completed_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
        completed_by: "user3",
      },
      {
        id: "check6",
        content: "Draft new content",
        completed: false,
      },
      {
        id: "check7",
        content: "Get approval from marketing team",
        completed: false,
      },
    ],
  },
  {
    id: "task10",
    org_id: "org1",
    title: "Website Refresh Project",
    description:
      "Comprehensive refresh of the company website including content, design, and functionality",
    due_date: new Date(Date.now() + 86400000 * 45).toISOString(), // 45 days from now
    priority: "High",
    status: "In Progress",
    assigned_to: "user2",
    assigned_by: "user1",
    category: "IT",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    tags: ["website", "IT", "project"],
    project_id: "project1",
    team_id: "team1",
    estimated_hours: 160,
    actual_hours: 35,
    watchers: ["user1", "user3", "user4"],
  },
];

// Task service functions
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    console.log("Starting fetchTasks function");

    // In a real application, this would fetch from Supabase
    // const supabase = createClient();
    // const { data, error } = await supabase.from('tasks').select('*');
    // if (error) throw error;
    // return data as Task[];

    // For now, return mock data
    console.log("Returning mock tasks data, count:", mockTasks.length);
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTasks), 300);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    console.error(
      "Error details:",
      JSON.stringify(error, Object.getOwnPropertyNames(error)),
    );
    throw error;
  }
};

export const fetchTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    // In a real application, this would fetch from Supabase
    // const supabase = createClient();
    // const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
    // if (error) throw error;
    // return data as Task;

    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = mockTasks.find((t) => t.id === taskId) || null;
        resolve(task);
      }, 300);
    });
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

export const createTask = async (
  task: Omit<Task, "id" | "created_at" | "updated_at">,
): Promise<Task> => {
  try {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // In a real application, this would insert into Supabase
    // const supabase = createClient();
    // const { data, error } = await supabase.from('tasks').insert(newTask).single();
    // if (error) throw error;
    // return data as Task;

    // For now, return the new task
    return new Promise((resolve) => {
      setTimeout(() => {
        mockTasks.push(newTask);
        resolve(newTask);
      }, 300);
    });
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>,
): Promise<Task> => {
  try {
    // In a real application, this would update in Supabase
    // const supabase = createClient();
    // const { data, error } = await supabase
    //   .from('tasks')
    //   .update({ ...updates, updated_at: new Date().toISOString() })
    //   .eq('id', taskId)
    //   .single();
    // if (error) throw error;
    // return data as Task;

    // For now, update the mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockTasks.findIndex((t) => t.id === taskId);
        if (index === -1) throw new Error(`Task with ID ${taskId} not found`);

        const updatedTask = {
          ...mockTasks[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };

        mockTasks[index] = updatedTask;
        resolve(updatedTask);
      }, 300);
    });
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    // In a real application, this would delete from Supabase
    // const supabase = createClient();
    // const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    // if (error) throw error;

    // For now, remove from mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockTasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
          mockTasks.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};

export const addTaskComment = async (
  taskId: string,
  comment: Omit<TaskComment, "id" | "created_at">,
): Promise<TaskComment> => {
  try {
    const newComment: TaskComment = {
      ...comment,
      id: uuidv4(),
      created_at: new Date().toISOString(),
    };

    // In a real application, this would insert into Supabase
    // const supabase = createClient();
    // const { data, error } = await supabase.from('task_comments').insert(newComment).single();
    // if (error) throw error;

    // For now, update the mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = mockTasks.find((t) => t.id === taskId);
        if (!task) throw new Error(`Task with ID ${taskId} not found`);

        if (!task.comments) task.comments = [];
        task.comments.push(newComment);

        resolve(newComment);
      }, 300);
    });
  } catch (error) {
    console.error(`Error adding comment to task with ID ${taskId}:`, error);
    throw error;
  }
};

export const addTaskChecklistItem = async (
  taskId: string,
  item: Omit<TaskChecklistItem, "id">,
): Promise<TaskChecklistItem> => {
  try {
    const newItem: TaskChecklistItem = {
      ...item,
      id: uuidv4(),
    };

    // In a real application, this would insert into Supabase
    // const supabase = createClient();
    // const { data, error } = await supabase.from('task_checklist_items').insert(newItem).single();
    // if (error) throw error;

    // For now, update the mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = mockTasks.find((t) => t.id === taskId);
        if (!task) throw new Error(`Task with ID ${taskId} not found`);

        if (!task.checklist) task.checklist = [];
        task.checklist.push(newItem);

        resolve(newItem);
      }, 300);
    });
  } catch (error) {
    console.error(
      `Error adding checklist item to task with ID ${taskId}:`,
      error,
    );
    throw error;
  }
};

export const updateTaskChecklistItem = async (
  taskId: string,
  itemId: string,
  updates: Partial<TaskChecklistItem>,
): Promise<TaskChecklistItem> => {
  try {
    // In a real application, this would update in Supabase
    // const supabase = createClient();
    // const { data, error } = await supabase
    //   .from('task_checklist_items')
    //   .update(updates)
    //   .eq('id', itemId)
    //   .single();
    // if (error) throw error;
    // return data as TaskChecklistItem;

    // For now, update the mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = mockTasks.find((t) => t.id === taskId);
        if (!task || !task.checklist)
          throw new Error(`Task with ID ${taskId} or checklist not found`);

        const index = task.checklist.findIndex((i) => i.id === itemId);
        if (index === -1)
          throw new Error(`Checklist item with ID ${itemId} not found`);

        const updatedItem = {
          ...task.checklist[index],
          ...updates,
        };

        task.checklist[index] = updatedItem;
        resolve(updatedItem);
      }, 300);
    });
  } catch (error) {
    console.error(`Error updating checklist item with ID ${itemId}:`, error);
    throw error;
  }
};

export const fetchUsers = async (): Promise<typeof mockUsers> => {
  // In a real application, this would fetch from Supabase
  // For now, return mock users
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), 300);
  });
};

export const getTaskCategories = (): string[] => {
  return [
    "HR",
    "Documentation",
    "Onboarding",
    "Events",
    "Finance",
    "Compliance",
    "Client Relations",
    "Development",
    "Marketing",
  ];
};

export const isTaskOverdue = (dueDate: string): boolean => {
  const now = new Date();
  const due = new Date(dueDate);
  return now > due;
};
