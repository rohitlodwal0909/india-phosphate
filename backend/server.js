const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const sequelize = require("./config/db");

const router = require("./routes");

dotenv.config();
const app = express();
const server = http.createServer(app);
//  Body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"] // or your frontend URL
  }
});
// Make io available globally
global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
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

//  DB connection and start
sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected");
    server.listen(process.env.PORT || 5000, () =>
      console.log("Backend server running on port 5000")
    );
  })
  .catch((err) => console.error("DB connection failed:", err));
