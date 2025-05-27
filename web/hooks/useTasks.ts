import { useState, useEffect, useCallback } from 'react';
import { Task, TaskComment, TaskChecklistItem } from '../../packages/types';
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment,
  addTaskChecklistItem,
  updateTaskChecklistItem,
  isTaskOverdue,
} from '@/services/tasks';
import { getTeams } from '@/services/teams';
import { fetchProjects } from '@/services/projects';
import { CalendarService } from '@/services/calendar';

export type TaskFilter = {
  status?: Task['status'][];
  priority?: Task['priority'][];
  category?: string[];
  assignedTo?: string[];
  dueDateRange?: { from?: Date; to?: Date };
  search?: string;
  tags?: string[];
  showCompleted?: boolean;
  teamId?: string;
  projectId?: string;
  isRecurring?: boolean;
};

export const useTasks = (initialFilter?: TaskFilter) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<TaskFilter>(initialFilter || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Fetch all tasks
  const loadTasks = useCallback(async () => {
    try {
      console.log("Starting loadTasks in useTasks hook");
      setLoading(true);
      setError(null);
      
      console.log("About to call fetchTasks()");
      const data = await fetchTasks();
      console.log("fetchTasks completed successfully, got", data.length, "tasks");
      setTasks(data);
      
      // Load teams and projects for integration
      console.log("About to fetch teams and projects");
      try {
        const teamsData = await getTeams('org1'); // Using org1 as the default org ID
        console.log("Teams data fetched successfully:", teamsData);
        setTeams(teamsData);
      } catch (teamsError) {
        console.error("Error fetching teams:", teamsError);
        setTeams([]);
      }
      
      try {
        const projectsData = await fetchProjects();
        console.log("Projects data fetched successfully:", projectsData);
        setProjects(projectsData);
      } catch (projectsError) {
        console.error("Error fetching projects:", projectsError);
        setProjects([]);
      }
    } catch (err) {
      console.error("Error in loadTasks:", err);
      console.error("Error details:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      setError(err instanceof Error ? err : new Error('Failed to load tasks'));
    } finally {
      setLoading(false);
      console.log("loadTasks completed");
    }
  }, []);

  // Apply filters to tasks
  useEffect(() => {
    const applyFilters = () => {
      let result = [...tasks];

      // Filter by status
      if (filter.status && filter.status.length > 0) {
        result = result.filter(task => filter.status!.includes(task.status));
      }

      // Filter by priority
      if (filter.priority && filter.priority.length > 0) {
        result = result.filter(task => filter.priority!.includes(task.priority));
      }

      // Filter by category
      if (filter.category && filter.category.length > 0) {
        result = result.filter(task => task.category && filter.category!.includes(task.category));
      }

      // Filter by assigned to
      if (filter.assignedTo && filter.assignedTo.length > 0) {
        result = result.filter(task => task.assigned_to && filter.assignedTo!.includes(task.assigned_to));
      }

      // Filter by due date range
      if (filter.dueDateRange) {
        const { from, to } = filter.dueDateRange;
        if (from) {
          result = result.filter(task => new Date(task.due_date) >= from);
        }
        if (to) {
          result = result.filter(task => new Date(task.due_date) <= to);
        }
      }

      // Filter by search text (title, description)
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        result = result.filter(
          task =>
            task.title.toLowerCase().includes(searchLower) ||
            (task.description && task.description.toLowerCase().includes(searchLower))
        );
      }

      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        result = result.filter(
          task => task.tags && filter.tags!.some(tag => task.tags!.includes(tag))
        );
      }

      // Filter out completed tasks if showCompleted is false
      if (filter.showCompleted === false) {
        result = result.filter(task => task.status !== 'Completed');
      }
      
      // Filter by team ID
      if (filter.teamId) {
        result = result.filter(task => task.team_id === filter.teamId);
      }
      
      // Filter by project ID
      if (filter.projectId) {
        result = result.filter(task => task.project_id === filter.projectId);
      }
      
      // Filter by recurring status
      if (filter.isRecurring !== undefined) {
        result = result.filter(task => task.is_recurring === filter.isRecurring);
      }

      return result;
    };

    setFilteredTasks(applyFilters());
  }, [tasks, filter]);

  // Load initial tasks
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // CRUD operations
  const getTaskById = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      const task = await fetchTaskById(taskId);
      setSelectedTask(task);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get task ${taskId}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const task = await createTask(newTask);
      setTasks(prev => [...prev, task]);
      return task;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create task'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const editTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      setLoading(true);
      const updatedTask = await updateTask(taskId, updates);
      setTasks(prev => prev.map(task => (task.id === taskId ? updatedTask : task)));
      
      // Update selectedTask if it's the one being edited
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(updatedTask);
      }
      
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update task ${taskId}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedTask]);

  const removeTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Clear selectedTask if it's the one being deleted
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete task ${taskId}`));
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedTask]);

  // Task comments
  const addComment = useCallback(async (taskId: string, comment: Omit<TaskComment, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const newComment = await addTaskComment(taskId, comment);
      
      // Update local state
      setTasks(prev => 
        prev.map(task => {
          if (task.id === taskId) {
            const comments = task.comments || [];
            return { ...task, comments: [...comments, newComment] };
          }
          return task;
        })
      );
      
      // Update selectedTask if it's the one being modified
      if (selectedTask && selectedTask.id === taskId) {
        const comments = selectedTask.comments || [];
        setSelectedTask({ ...selectedTask, comments: [...comments, newComment] });
      }
      
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to add comment to task ${taskId}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedTask]);

  // Task checklist items
  const addChecklistItem = useCallback(async (taskId: string, item: Omit<TaskChecklistItem, 'id'>) => {
    try {
      setLoading(true);
      const newItem = await addTaskChecklistItem(taskId, item);
      
      // Update local state
      setTasks(prev => 
        prev.map(task => {
          if (task.id === taskId) {
            const checklist = task.checklist || [];
            return { ...task, checklist: [...checklist, newItem] };
          }
          return task;
        })
      );
      
      // Update selectedTask if it's the one being modified
      if (selectedTask && selectedTask.id === taskId) {
        const checklist = selectedTask.checklist || [];
        setSelectedTask({ ...selectedTask, checklist: [...checklist, newItem] });
      }
      
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to add checklist item to task ${taskId}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedTask]);

  const updateChecklistItem = useCallback(async (
    taskId: string,
    itemId: string,
    updates: Partial<TaskChecklistItem>
  ) => {
    try {
      setLoading(true);
      const updatedItem = await updateTaskChecklistItem(taskId, itemId, updates);
      
      // Update local state
      setTasks(prev => 
        prev.map(task => {
          if (task.id === taskId && task.checklist) {
            return {
              ...task,
              checklist: task.checklist.map(item => 
                item.id === itemId ? { ...item, ...updates } : item
              )
            };
          }
          return task;
        })
      );
      
      // Update selectedTask if it's the one being modified
      if (selectedTask && selectedTask.id === taskId && selectedTask.checklist) {
        setSelectedTask({
          ...selectedTask,
          checklist: selectedTask.checklist.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        });
      }
      
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update checklist item ${itemId}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedTask]);

  // Create a calendar event from a task
  const createCalendarEventFromTask = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error(`Task with ID ${taskId} not found`);
      
      const event = await CalendarService.createEvent({
        title: `Task: ${task.title}`,
        start: new Date(task.due_date),
        end: new Date(task.due_date),
        type: 'deadline',
        description: task.description,
      });
      
      if (event) {
        // Update the task with the related event ID
        await editTask(taskId, { related_event_id: event.id });
      }
      
      return event;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to create calendar event for task ${taskId}`));
      return null;
    }
  }, [tasks, editTask]);
  
  // Create a recurring task
  const createRecurringTask = useCallback(async (
    baseTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>, 
    recurrencePattern: string,
    endDate?: string
  ) => {
    try {
      setLoading(true);
      
      const task = await createTask({
        ...baseTask,
        is_recurring: true,
        recurrence_pattern: recurrencePattern,
        recurrence_end_date: endDate,
      });
      
      return task;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create recurring task'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [createTask]);
  
  // Create subtask (task dependency)
  const createSubtask = useCallback(async (
    parentTaskId: string,
    subtask: Omit<Task, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      setLoading(true);
      
      const task = await createTask({
        ...subtask,
        parent_task_id: parentTaskId,
      });
      
      return task;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to create subtask for task ${parentTaskId}`));
      return null;
    } finally {
      setLoading(false);
    }
  }, [createTask]);
  
  // Get all subtasks for a parent task
  const getSubtasks = useCallback((parentTaskId: string) => {
    return tasks.filter(task => task.parent_task_id === parentTaskId);
  }, [tasks]);
  
  // Add a watcher to a task
  const addTaskWatcher = useCallback(async (taskId: string, userId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error(`Task with ID ${taskId} not found`);
      
      const watchers = task.watchers || [];
      if (watchers.includes(userId)) return task; // User already watching
      
      const updatedTask = await editTask(taskId, { 
        watchers: [...watchers, userId] 
      });
      
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to add watcher to task ${taskId}`));
      return null;
    }
  }, [tasks, editTask]);
  
  // Remove a watcher from a task
  const removeTaskWatcher = useCallback(async (taskId: string, userId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error(`Task with ID ${taskId} not found`);
      
      const watchers = task.watchers || [];
      if (!watchers.includes(userId)) return task; // User not watching
      
      const updatedTask = await editTask(taskId, { 
        watchers: watchers.filter(id => id !== userId) 
      });
      
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to remove watcher from task ${taskId}`));
      return null;
    }
  }, [tasks, editTask]);
  
  // Log time spent on a task
  const logTaskTime = useCallback(async (taskId: string, hours: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error(`Task with ID ${taskId} not found`);
      
      const currentHours = task.actual_hours || 0;
      
      const updatedTask = await editTask(taskId, { 
        actual_hours: currentHours + hours 
      });
      
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to log time for task ${taskId}`));
      return null;
    }
  }, [tasks, editTask]);

  // Mark task as completed
  const completeTask = useCallback(async (taskId: string) => {
    try {
      return await editTask(taskId, { 
        status: 'Completed',
        completed_at: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to complete task ${taskId}`));
      return null;
    }
  }, [editTask]);

  // Check if a task is overdue
  const isOverdue = useCallback((dueDate: string) => {
    return isTaskOverdue(dueDate);
  }, []);

  return {
    tasks,
    filteredTasks,
    selectedTask,
    loading,
    error,
    filter,
    teams,
    projects,
    setFilter,
    setSelectedTask,
    loadTasks,
    getTaskById,
    addTask,
    editTask,
    removeTask,
    addComment,
    addChecklistItem,
    updateChecklistItem,
    completeTask,
    isOverdue,
    createCalendarEventFromTask,
    createRecurringTask,
    createSubtask,
    getSubtasks,
    addTaskWatcher,
    removeTaskWatcher,
    logTaskTime,
  };
}; 