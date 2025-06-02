import type { NextApiRequest, NextApiResponse } from "next";
import { RequestPanelService } from "../../lib/database/fixed-services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case "GET":
        if (query.action === "analytics") {
          // Get request analytics
          const result = await RequestPanelService.getRequestAnalytics();

          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(500).json({ error: result.error });
          }
        } else if (query.action === "by-type") {
          // Get requests by type
          const { type } = query;
          if (!type) {
            return res.status(400).json({ error: "Type is required" });
          }

          const result = await RequestPanelService.getRequestsByType(
            type as string,
          );

          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(500).json({ error: result.error });
          }
        } else {
          // Get all requests with pagination and filters (default action)
          const pagination = {
            page: parseInt(query.page as string) || 1,
            limit: parseInt(query.limit as string) || 10,
            orderBy: (query.orderBy as string) || "created_at",
            ascending: query.ascending === "true",
          };

          const filters = query.filters
            ? JSON.parse(query.filters as string)
            : [];

          const result = await RequestPanelService.getAllRequests(
            pagination,
            filters,
          );

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
        if (query.action === "approve") {
          // Approve request
          const { requestId, approverId, comments } = body;
          const result = await RequestPanelService.approveRequest(
            requestId,
            approverId,
            comments,
          );

          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else if (query.action === "add-comment") {
          // Add comment to request
          const { requestId, ...commentData } = body;
          const result = await RequestPanelService.addRequestComment(
            requestId,
            commentData,
          );

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else {
          // Create new request
          const result = await RequestPanelService.createRequest(body);

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        }

      case "PUT":
        if (!query.id) {
          return res.status(400).json({ error: "Request ID is required" });
        }

        const updateResult = await RequestPanelService.updateRequest(
          query.id as string,
          body,
        );

        if (updateResult.success) {
          return res.status(200).json(updateResult.data);
        } else {
          return res.status(400).json({ error: updateResult.error });
        }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Request Panel API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: "Using enhanced database service with fallback support",
    });
  }
}
