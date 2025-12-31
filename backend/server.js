const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectToDB = require("./config/db");
const { Server } = require("socket.io");
const http = require("http");
const Canvas = require("./models/canvasModel");
const jwt = require("jsonwebtoken");

// ✅ USE ENV VARIABLE
const SECRET_KEY = process.env.JWT_SECRET;

// Routes
const userRoutes = require("./routes/userRoutes");
const canvasRoutes = require("./routes/canvasRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/canvas", canvasRoutes);

// DB connection
connectToDB();

// Create server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://whiteboard-tutorial-eight.vercel.app",
      // add Render URL here after deploy
    ],
    methods: ["GET", "POST"],
  },
});

let canvasData = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinCanvas", async ({ canvasId }) => {
    try {
      const authHeader = socket.handshake.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        socket.emit("unauthorized", { message: "Access Denied: No Token" });
        return;
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.userId;

      const canvas = await Canvas.findById(canvasId);

      if (
        !canvas ||
        (String(canvas.owner) !== String(userId) &&
          !canvas.shared.includes(userId))
      ) {
        socket.emit("unauthorized", {
          message: "You are not authorized to join this canvas.",
        });
        return;
      }

      socket.join(canvasId);
      console.log(`User ${socket.id} joined canvas ${canvasId}`);

      if (canvasData[canvasId]) {
        socket.emit("loadCanvas", canvasData[canvasId]);
      } else {
        socket.emit("loadCanvas", canvas.elements);
      }
    } catch (error) {
      console.error(error);
      socket.emit("error", {
        message: "An error occurred while joining the canvas.",
      });
    }
  });

  socket.on("drawingUpdate", async ({ canvasId, elements }) => {
    try {
      canvasData[canvasId] = elements;

      socket.to(canvasId).emit("receiveDrawingUpdate", elements);

      await Canvas.findByIdAndUpdate(canvasId, { elements });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ RENDER-COMPATIBLE PORT
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
