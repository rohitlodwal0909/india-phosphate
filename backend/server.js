const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authentication/AuthRoutes");
const permissionRoutes = require("./routes/authentication/PermissionRoutes");
const userRoutes = require("./routes/usermanagment/UserRoutes");
const guardRoutes = require("./routes/inventory/GuardEntryRoutes");
const grnRoutes = require("./routes/inventory/GrnEntryRoutes");
const qaQcRoutes = require("./routes/inventory/QaqcRoutes");
const dispatchRoutes = require("./routes/inventory/DispatchRoutes");

dotenv.config();
const app = express();

//  Body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(userRoutes);
app.use(guardRoutes);
app.use(grnRoutes);
app.use(qaQcRoutes);
app.use(dispatchRoutes);
app.use(permissionRoutes);
//  DB connection and start
sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Backend server running on port 5000")
    );
  })
  .catch((err) => console.error("DB connection failed:", err));
