import dotenv from "dotenv";
dotenv.config();

import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import userRouter from "./router/authRouter.js";

const app = express();
app.use(express.json());

// إعداد Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HMS API Documentation",
      version: "1.0.0",
      description: "API documentation for HMS authentication system",
    },
    servers: [
      {
        url: "http://localhost:" + (process.env.PORT || 8000) + "/HMS",
      },
    ],
  },
  apis: ["./dist/router/*.js"], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/HMS/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/HMS", userRouter);

app.get("/HMS", (req, res) => {
  res.send("welcome with HMS");
});

const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/HMS`);
  console.log(`📄 Swagger docs available on http://localhost:${PORT}/HMS/api-docs`);
});
