import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";

import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import authRoute from "./routes/auth.route.js";
import songsRoute from "./routes/songs.route.js";
import albumsRoute from "./routes/albums.route.js";
import statsRoute from "./routes/stats.route.js";

import { initializeSocket } from "./lib/socket.js";

import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import { createServer } from "http";

import cron from "node-cron";
import fs from "fs";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

const __dirname = path.resolve();

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(clerkMiddleware()); // this will add auth to req.obj => req.user.id (auth)
app.use(express.json()); // to parse req.body

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true, // if folder 'tmp' not exist, it creates it
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB maximum filesize
    },
  })
);

const tempDir = path.join(process.cwd(), "tmp");
// cron jobs => delete all every hour files from tmp folder
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/auth", authRoute);
app.use("/api/songs", songsRoute);
app.use("/api/albums", albumsRoute);
app.use("/api/stats", statsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ? error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

httpServer.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
