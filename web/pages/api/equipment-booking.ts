import type { NextApiRequest, NextApiResponse } from "next";
import { EquipmentBookingService } from "../../lib/database/fixed-services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case "GET":
        if (query.action === "equipment") {
          // Get all equipment
          const pagination = {
            page: parseInt(query.page as string) || 1,
            limit: parseInt(query.limit as string) || 10,
            orderBy: (query.orderBy as string) || "name",
            ascending: query.ascending !== "false",
          };

          const filters = query.filters
            ? JSON.parse(query.filters as string)
            : [];

          const result = await EquipmentBookingService.getEquipment(
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
          // Get all equipment bookings
          const pagination = {
            page: parseInt(query.page as string) || 1,
            limit: parseInt(query.limit as string) || 10,
            orderBy: (query.orderBy as string) || "created_at",
            ascending: query.ascending === "true",
          };

          const filters = query.filters
            ? JSON.parse(query.filters as string)
            : [];

          const result = await EquipmentBookingService.getBookings(
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
        if (query.action === "return") {
          // Return equipment
          const { bookingId, condition, notes } = body;
          const result = await EquipmentBookingService.returnEquipment(
            bookingId,
            condition,
            notes,
          );

          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else {
          // Create new equipment booking
          const result = await EquipmentBookingService.createBooking(body);

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        }

      case "PUT":
        if (!query.id) {
          return res.status(400).json({ error: "Booking ID is required" });
        }

        const updateResult = await EquipmentBookingService.updateBooking(
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
    console.error("Equipment Booking API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: "Using enhanced database service with fallback support",
    });
  }
}
