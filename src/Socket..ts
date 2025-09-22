import { Server } from "socket.io";
import MessagesService from "./services/messagesService.js";

const messagesService = new MessagesService();

export function setupSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("send_message", async (data) => {
      const { sender_id, receiver_id, content } = data;
      const result = await messagesService.sendMessage(sender_id, receiver_id, content);

      if (result.success) {
        io.to(receiver_id.toString()).emit("receive_message", result.message);

        io.to(sender_id.toString()).emit("receive_message", result.message);
        console.log(result.message);
        
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
}
