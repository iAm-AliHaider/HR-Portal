import type { NextApiRequest, NextApiResponse } from "next";
import { ChatService } from "../../lib/database/fixed-services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case "GET":
        if (query.action === "channels") {
          // Get user channels
          const { userId } = query;
          if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
          }

          const result = await ChatService.getChannels(userId as string);

          if (result.success) {
            return res.status(200).json(result.data);
          } else {
            return res.status(500).json({ error: result.error });
          }
        } else if (query.action === "messages") {
          // Get channel messages
          const { channelId } = query;
          if (!channelId) {
            return res.status(400).json({ error: "Channel ID is required" });
          }

          const pagination = {
            page: parseInt(query.page as string) || 1,
            limit: parseInt(query.limit as string) || 50,
            orderBy: (query.orderBy as string) || "sent_at",
            ascending: query.ascending === "true",
          };

          const result = await ChatService.getMessages(
            channelId as string,
            pagination,
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
          // Default action: return basic chat system info and available channels
          const result = await ChatService.getChannels("demo-user");

          return res.status(200).json({
            message: "Chat system is operational",
            status: "working",
            endpoints: {
              channels: "/api/chat?action=channels&userId={userId}",
              messages: "/api/chat?action=messages&channelId={channelId}",
              createChannel: "POST /api/chat?action=create-channel",
              sendMessage: "POST /api/chat?action=send-message",
            },
            sampleChannels: result.success ? result.data : [],
          });
        }

      case "POST":
        if (query.action === "create-channel") {
          // Create new channel
          const result = await ChatService.createChannel(body);

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else if (query.action === "send-message") {
          // Send message
          const result = await ChatService.sendMessage(body);

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else if (query.action === "add-member") {
          // Add channel member
          const { channelId, userId, role } = body;
          const result = await ChatService.addChannelMember(
            channelId,
            userId,
            role,
          );

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else if (query.action === "add-reaction") {
          // Add message reaction
          const { messageId, userId, emoji } = body;
          const result = await ChatService.addReaction(
            messageId,
            userId,
            emoji,
          );

          if (result.success) {
            return res.status(201).json(result.data);
          } else {
            return res.status(400).json({ error: result.error });
          }
        } else {
          return res.status(400).json({ error: "Invalid action" });
        }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: "Using enhanced database service with fallback support",
    });
  }
}
