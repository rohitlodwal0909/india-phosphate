// routes/PackingMaterialRoutes.js
const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/master/ManufacturingProcedure/ManufacturingProcedureController");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/create-procedure", authMiddleware, Controller.createProcedure);
router.get("/get-procedure", authMiddleware, Controller.getProcedure);

router.put("/update-procedure/:id", authMiddleware, Controller.updateProcedure);
router.delete(
  "/delete-procedure/:id",
  authMiddleware,
  Controller.deleteProcedure
);

module.exports = router;
