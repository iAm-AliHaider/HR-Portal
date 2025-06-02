import type { NextApiRequest, NextApiResponse } from "next";
import { MeetingRoomsService } from "../../lib/database/fixed-services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case "GET":
        if (query.action === "available") {
          // Get available rooms
          const { startTime, endTime, capacity } = query;
          const result = await MeetingRoomsService.getAvailableRooms(
            startTime as string,
            endTime as string,
            capacity ? parseInt(capacity as string) : undefined,
          );

          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(500).json({ error: result.error });
          }
        } else if (query.action === "bookings") {
          // Get room bookings
          const pagination = {
            page: parseInt(query.page as string) || 1,
            limit: parseInt(query.limit as string) || 10,
            orderBy: (query.orderBy as string) || "start_time",
            ascending: query.ascending === "true",
          };

          const filters = query.filters
            ? JSON.parse(query.filters as string)
            : [];

          const result = await MeetingRoomsService.getBookings(
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
        } else {
          // Get all rooms
          const pagination = {
            page: parseInt(query.page as string) || 1,
            limit: parseInt(query.limit as string) || 10,
            orderBy: (query.orderBy as string) || "name",
            ascending: query.ascending !== "false",
          };

          const filters = query.filters
            ? JSON.parse(query.filters as string)
            : [];

          const result = await MeetingRoomsService.getRooms(
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
        // Create new booking
        const result = await MeetingRoomsService.createBooking(body);

        if (result.success) {
          return res.status(201).json(result.data);
        } else {
          return res.status(400).json({ error: result.error });
        }

      case "PUT":
        if (!query.id) {
          return res.status(400).json({ error: "Booking ID is required" });
        }

        if (query.action === "cancel") {
          // Cancel booking
          const { reason } = body;
          const cancelResult = await MeetingRoomsService.cancelBooking(
            query.id as string,
            reason,
          );

          if (cancelResult.success) {
            return res.status(200).json(cancelResult.data);
          } else {
            return res.status(400).json({ error: cancelResult.error });
          }
        } else {
          // Update booking
          const updateResult = await MeetingRoomsService.updateBooking(
            query.id as string,
            body,
          );

          if (updateResult.success) {
            return res.status(200).json(updateResult.data);
          } else {
            return res.status(400).json({ error: updateResult.error });
          }
        }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Meeting Rooms API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: "Using enhanced database service with fallback support",
    });
  }
}
