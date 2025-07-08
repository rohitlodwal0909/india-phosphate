const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const sequelize = require("./config/db");
const authRoutes = require("./routes/authentication/AuthRoutes");
const permissionRoutes = require("./routes/authentication/PermissionRoutes");
const userRoutes = require("./routes/usermanagment/UserRoutes");
const guardRoutes = require("./routes/inventory/GuardEntryRoutes");
const grnRoutes = require("./routes/inventory/GrnEntryRoutes");
const qaQcRoutes = require("./routes/inventory/QaqcRoutes");
const dispatchRoutes = require("./routes/inventory/DispatchRoutes");
const productionRoutes = require("./routes/inventory/ProdutionRoutes");
const NotificationRouter = require("./routes/notification/NotificationRoutes");
dotenv.config();
const app = express();
const server = http.createServer(app);
//  Body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "*",
   methods: ["GET", "POST"] // or your frontend URL
  },
});
// Make io available globally
global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

app.use(authRoutes);
app.use(userRoutes);
app.use(guardRoutes);
app.use(grnRoutes);
app.use(qaQcRoutes);
app.use(dispatchRoutes);
app.use(productionRoutes);
app.use(permissionRoutes);
app.use(NotificationRouter)
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
