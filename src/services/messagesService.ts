import messagesDB from "../models/messagesDB.js";
import usersBD from "../models/authDB.js";

class MessagesService {
  async sendMessage(sender_id: number, receiver_id: number, content: string) {
    if (!sender_id || !receiver_id || !content) {
      return { success: false, message: "All fields are required" };
    }
    const finduser1 = await usersBD.getUserById(sender_id);
    const finduser2 = await usersBD.getUserById(receiver_id);
    if (!finduser1 || !finduser2) {
      return { success: false, message: "Sender or Receiver does not exist" };
    }
    const message = await messagesDB.createMessage(
      sender_id,
      receiver_id,
      content
    );
    return { success: true, message };
  }

  async getConversation(user1: number, user2: number) {
    const messages = await messagesDB.getConversation(user1, user2);
    return { success: true, messages };
  }
}

export default MessagesService;
