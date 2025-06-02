import type { NextApiRequest, NextApiResponse } from "next";
import { BusinessTravelService } from "../../lib/database/fixed-services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case "GET":
        // Get travel requests with pagination and filters
        const pagination = {
          page: parseInt(query.page as string) || 1,
          limit: parseInt(query.limit as string) || 10,
          orderBy: (query.orderBy as string) || "created_at",
          ascending: query.ascending === "true",
        };

        const filters = query.filters
          ? JSON.parse(query.filters as string)
          : [];

        const result = await BusinessTravelService.getTravelRequests(
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

      case "POST":
        if (query.action === "approve") {
          // Approve travel request
          const { requestId, approverId, budget } = body;
          const result = await BusinessTravelService.approveTravelRequest(
            requestId,
            approverId,
            budget,
          );

          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else if (query.action === "add-booking") {
          // Add travel booking
          const { requestId, ...bookingData } = body;
          const result = await BusinessTravelService.addTravelBooking(
            requestId,
            bookingData,
          );

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else if (query.action === "add-expense") {
          // Add travel expense
          const { requestId, ...expenseData } = body;
          const result = await BusinessTravelService.addTravelExpense(
            requestId,
            expenseData,
          );

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else {
          // Create new travel request
          const result = await BusinessTravelService.createTravelRequest(body);

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        }

      case "PUT":
        if (!query.id) {
          return res
            .status(400)
            .json({ error: "Travel request ID is required" });
        }

        const updateResult = await BusinessTravelService.updateTravelRequest(
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
    console.error("Business Travel API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: "Using enhanced database service with fallback support",
    });
  }
}
