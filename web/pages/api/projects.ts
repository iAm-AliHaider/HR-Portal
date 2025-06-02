import type { NextApiRequest, NextApiResponse } from "next";
import { ProjectsService } from "../../lib/database/fixed-services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case "GET":
        if (query.id) {
          if (query.action === "analytics") {
            // Get project analytics
            const result = await ProjectsService.getProjectAnalytics(
              query.id as string,
            );
            if (result.success) {
              return res.status(200).json(result.data);
            } else {
              return res.status(404).json({ error: result.error });
            }
          } else {
            // Get specific project
            const result = await ProjectsService.getById(query.id as string);
            if (result.success) {
              return res.status(200).json(result.data);
            } else {
              return res.status(404).json({ error: result.error });
            }
          }
        } else {
          // Get all projects with pagination and filters
          const pagination = {
            page: parseInt(query.page as string) || 1,
            limit: parseInt(query.limit as string) || 10,
            orderBy: (query.orderBy as string) || "created_at",
            ascending: query.ascending === "true",
          };

          const filters = query.filters
            ? JSON.parse(query.filters as string)
            : [];

          const result = await ProjectsService.getAll(pagination, filters);

          if (result.success) {
            return res.status(200).json({
              data: result.data,
              count: result.count,
              pagination,
            });
          } else {
            return res.status(500).json({ error: result.error });
          }
        }

      case "POST":
        if (query.action === "add-task") {
          // Add task to project
          const { projectId, ...taskData } = body;
          const result = await ProjectsService.addTask(projectId, taskData);

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else {
          // Create new project
          const result = await ProjectsService.create(body);

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        }

      case "PUT":
        if (query.action === "update-task") {
          // Update project task
          const { taskId, ...updates } = body;
          const result = await ProjectsService.updateTask(taskId, updates);

          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else {
          // Update project
          if (!query.id) {
            return res.status(400).json({ error: "Project ID is required" });
          }

          const updateResult = await ProjectsService.update(
            query.id as string,
            body,
          );

          if (updateResult.success) {
            return res.status(200).json(updateResult.data);
          } else {
            return res.status(400).json({ error: updateResult.error });
          }
        }

      case "DELETE":
        if (!query.id) {
          return res.status(400).json({ error: "Project ID is required" });
        }

        const deleteResult = await ProjectsService.delete(query.id as string);

        if (deleteResult.success) {
          return res
            .status(200)
            .json({ message: "Project deleted successfully" });
        } else {
          return res.status(400).json({ error: deleteResult.error });
        }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Projects API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: "Using enhanced database service with fallback support",
    });
  }
}
