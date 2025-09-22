import type MessagesService from "../services/messagesService.js";
import type { Request, Response } from "express";

class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  async sendMessage(req: Request, res: Response) {
    try {
      const { sender_id, receiver_id, content } = req.body;
      const result = await this.messagesService.sendMessage(
        sender_id,
        receiver_id,
        content
      );
      res.json(result);
    } catch (error) {
      console.error("Error in sendMessage:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getConversation(req: Request, res: Response) {
    try {
      const user1 = Number(req.params.user1);
      const user2 = Number(req.params.user2);
      if (!req.user || typeof req.user.id === "undefined") {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }
      const loggedInUser = req.user.id;
      if (isNaN(user1) || isNaN(user2)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user IDs" });
      }

      if (loggedInUser !== user1 && loggedInUser !== user2) {
        return res
          .status(403)
          .json({
            success: false,
            message: "Unauthorized to access this conversation",
          });
      }

      if (isNaN(user1) || isNaN(user2)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user IDs" });
      }
      const result = await this.messagesService.getConversation(user1, user2);
      res.json(result);
    } catch (error) {
      console.error("Error in getConversation:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default MessagesController;
