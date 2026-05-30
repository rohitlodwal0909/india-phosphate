const express = require("express");
const router = express.Router();
const TaskController = require("../../controllers/dashboard/TaskController");

router.get("/get-task", TaskController.getTask);

router.post("/store-task", TaskController.storeTask);

router.put("/update-task/:id", TaskController.updateTask);
router.put("/change-status-task/:id", TaskController.changestatusTask);

router.delete("/delete-task/:id", TaskController.deleteTask);

module.exports = router;
