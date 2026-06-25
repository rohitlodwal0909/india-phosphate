require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./config/db");
const router = require("./routes");
const startPaymentReminder = require("./cron/paymentReminder");
const enquiryCron = require("./cron/enquiryCron");
const app = express();
const server = http.createServer(app);
//  Body parser middleware

// Nnao Primary Key

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make io available globally
global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

const allowedIPs = ["172.18.0.1", "127.0.0.1"];

app.use((req, res, next) => {
  let clientIP =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;

  if (clientIP.includes("::ffff:")) {
    clientIP = clientIP.replace("::ffff:", "");
  }

  if (clientIP.includes(",")) {
    clientIP = clientIP.split(",")[0].trim();
  }

  console.log("Client IP:", clientIP);

  if (allowedIPs.includes(clientIP)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "ERP Access Allowed Only From Company WiFi",
    clientIP
  });
});

app.use("/", router);

app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    success: false,
    message,
    code: status
  });
});

// app.use(express.static(path.join(__dirname, "dist")));

// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

//  DB connection and start
sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected");
    startPaymentReminder();
    enquiryCron();

    server.listen(process.env.PORT || 5000, () =>
      console.log("Backend server running on port 5000")
    );
  })
  .catch((err) => console.error("DB connection failed:", err));
