import type { NextApiRequest, NextApiResponse } from "next";
import { TeamsService } from "../../lib/database/fixed-services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case "GET":
        if (query.id) {
          // Get specific team
          const result = await TeamsService.getById(query.id as string);
          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(404).json({ error: result.error });
          }
        } else {
          // Get all teams with pagination and filters
          const pagination = {
            page: parseInt(query.page as string) || 1,
            limit: parseInt(query.limit as string) || 10,
            orderBy: (query.orderBy as string) || "created_at",
            ascending: query.ascending === "true",
          };

          const filters = query.filters
            ? JSON.parse(query.filters as string)
            : [];

          const result = await TeamsService.getAll(pagination, filters);

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
        if (query.action === "add-member") {
          // Add team member
          const { teamId, memberId, role } = body;
          const result = await TeamsService.addMember(teamId, memberId, role);

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else if (query.action === "performance") {
          // Get team performance
          const result = await TeamsService.getTeamPerformance(
            query.teamId as string,
          );

          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(404).json({ error: result.error });
          }
        } else {
          // Create new team
          const result = await TeamsService.create(body);

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        }

      case "PUT":
        if (!query.id) {
          return res.status(400).json({ error: "Team ID is required" });
        }

        const updateResult = await TeamsService.update(
          query.id as string,
          body,
        );

        if (updateResult.success) {
          return res.status(200).json(updateResult.data);
        } else {
          return res.status(400).json({ error: updateResult.error });
        }

      case "DELETE":
        if (query.action === "remove-member") {
          // Remove team member
          const { teamId, memberId } = body;
          const result = await TeamsService.removeMember(teamId, memberId);

          if (result.success) {
            return res
              .status(200)
              .json({ message: "Member removed successfully" });
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else {
          // Delete team
          if (!query.id) {
            return res.status(400).json({ error: "Team ID is required" });
          }

          const deleteResult = await TeamsService.delete(query.id as string);

          if (deleteResult.success) {
            return res
              .status(200)
              .json({ message: "Team deleted successfully" });
          } else {
            return res.status(400).json({ error: deleteResult.error });
          }
        }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Teams API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: "Using enhanced database service with fallback support",
    });
  }
}
