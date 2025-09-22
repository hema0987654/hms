import { Router } from "express";
import MessagesService from "../services/messagesService.js";
import MessagesController from "../controllers/messagesController.js";
import { authenticateToken } from "../middlewares/authmiddleware.js";

const messagesService = new MessagesService();
const messagesController = new MessagesController(messagesService);

const msgRouter = Router();

msgRouter.post("/", authenticateToken, (req, res) => 
  messagesController.sendMessage(req, res)
);

msgRouter.get("/:user1/:user2", authenticateToken, (req, res) => 
  messagesController.getConversation(req, res)
);

export default msgRouter;
