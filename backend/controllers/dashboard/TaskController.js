const db = require("../../models");
const { Op, where } = require("sequelize");
const { getISTDateTime } = require("../../helper/dateTimeHelper");

const { TaskModel, User, Notification } = db;

/* =========================================================
   GET TASK
========================================================= */

exports.getTask = async (req, res) => {
  try {
    const data = await TaskModel.findAll({
      order: [["id", "DESC"]],

      where: {
        [Op.or]: [
          {
            user_id: req.admin.id
          },
          {
            assign_to: req.admin.id
          }
        ]
      },

      include: [
        {
          model: User,
          as: "assign_task",
          attributes: ["id", "username"],
          required: false
        },

        {
          model: User,
          as: "users",
          attributes: ["id", "username"],
          required: false
        }
      ]
    });

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("GET TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================================================
   STORE TASK
========================================================= */

exports.storeTask = async (req, res) => {
  try {
    const { entry_date, entry_time } = getISTDateTime();

    /* ================= CREATE TASK ================= */

    const task = await TaskModel.create({
      task_title: req.body.task_title,
      due_date: req.body.due_date,
      priority: req.body.priority,
      assign_to: req.body.assign_to,
      task_description: req.body.task_description,
      user_id: req.admin.id,
      created_at: `${entry_date} ${entry_time}`
    });

    /* ================= CREATE NOTIFICATION ================= */

    await Notification.create({
      user_id: req.body.assign_to,
      title: `New Task Assigned : ${req.body.task_title}`,
      message: req.body.task_description,
      is_read: 0,
      date_time: `${entry_date} ${entry_time}`
    });

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      data: task
    });
  } catch (error) {
    console.error("STORE TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================================================
   UPDATE TASK
========================================================= */

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= FIND TASK ================= */

    const task = await TaskModel.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    /* ================= UPDATE TASK ================= */

    await task.update({
      task_title: req.body.task_title,
      due_date: req.body.due_date,
      priority: req.body.priority,
      assign_to: req.body.assign_to,
      task_description: req.body.task_description
    });

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "Task Updated Successfully ✅",
      data: task
    });
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Update failed"
    });
  }
};

exports.changestatusTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { entry_date, entry_time } = getISTDateTime();

    /* ================= FIND TASK ================= */

    const task = await TaskModel.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    /* ================= VALIDATE STATUS ================= */

    const status = req.body.status;

    if (!req.body.status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    /* ================= CHECK ACCESS ================= */

    if (req.admin.id !== task.assign_to) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this task status"
      });
    }

    const now = new Date();
    const createdAt = new Date(task.created_at);

    const totalMinutes = Math.floor((now - createdAt) / (1000 * 60));

    const updateData = {
      status
    };

    /* ================= UPDATE STATUS ================= */

    if (["Pending", "In Progress"].includes(status) && !task.accepted_time) {
      updateData.accepted_time = totalMinutes;
    }

    // if (!task.first_response_time) {
    //   updateData.first_response_time = totalMinutes;
    // }

    if (status == "Completed" && !task.first_response) {
      updateData.first_response = totalMinutes;
    }

    await task.update(updateData);

    /* ================= SEND NOTIFICATION ================= */

    await Notification.create({
      user_id: task.user_id,
      title: `Task Status Updated`,
      message: `Task "${task.task_title}" status changed to "${req.body.status}"`,
      is_read: 0,
      date_time: `${entry_date} ${entry_time}`
    });

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: `Task status changed to "${req.body.status}" successfully ✅`,
      data: task
    });
  } catch (error) {
    console.error("CHANGE STATUS TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Status update failed"
    });
  }
};

/* =========================================================
   DELETE TASK
========================================================= */

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    /* ================= CHECK TASK ================= */

    const task = await TaskModel.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    /* ================= DELETE TASK ================= */

    await task.destroy();

    return res.status(200).json({
      success: true,
      message: "Task Deleted Successfully"
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
