const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const { Op, where, fn, col, literal } = require("sequelize");

const {
  Customer,
  PurchaseOrderModel,
  DispatchVehicle,
  DisputeModel,
  TaskModel
} = db;

exports.getallCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.findAll({
      order: [["created_at", "DESC"]]
    });

    const total_orders = await PurchaseOrderModel.count();

    const pending_orders = await DispatchVehicle.count({
      include: [
        {
          model: PurchaseOrderModel,
          as: "poentry"
        }
      ]
    });

    const total_disputes = await DisputeModel.findAll({
      order: [["created_at", "DESC"]]
    });

    const count = total_disputes.filter((dispute) => {
      const followups = JSON.parse(dispute?.followups || "[]");

      return !followups.some(
        (item) => item?.status?.toLowerCase() === "closed"
      );
    }).length;

    res.status(200).json({
      message: "customers fetched successfully",
      customers,
      total_orders,
      pending_orders,
      total_disputes: count
    });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeDashboard = async (req, res) => {
  try {
    /* =========================================================
        TODAY DATE
    ========================================================= */

    const today = new Date();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    /* =========================================================
        COMMON WHERE
    ========================================================= */

    const commonWhere = {
      [Op.or]: [
        {
          user_id: req.admin.id
        },
        {
          assign_to: req.admin.id
        }
      ]
    };

    /* =========================================================
        TOTAL TASKS
    ========================================================= */

    const totalTasks = await TaskModel.count({
      where: commonWhere
    });

    /* =========================================================
        COMPLETED TASKS
    ========================================================= */

    const completedTasks = await TaskModel.count({
      where: {
        ...commonWhere,

        status: "Completed"
      }
    });

    /* =========================================================
        REMAINING TASKS
    ========================================================= */

    const remainingTasks = await TaskModel.count({
      where: {
        ...commonWhere,

        status: {
          [Op.ne]: "Completed"
        }
      }
    });

    /* =========================================================
        PENDING TASKS
    ========================================================= */

    const pendingTasks = await TaskModel.count({
      where: {
        ...commonWhere,

        status: "Pending"
      }
    });

    /* =========================================================
        IN PROGRESS TASKS
    ========================================================= */

    const inProgressTasks = await TaskModel.count({
      where: {
        ...commonWhere,

        status: "In Progress"
      }
    });

    /* =========================================================
        OVERDUE TASKS
    ========================================================= */

    const overdueTasks = await TaskModel.count({
      where: {
        ...commonWhere,

        due_date: {
          [Op.lt]: today
        },

        status: {
          [Op.ne]: "Completed"
        }
      }
    });

    /* =========================================================
        SLA BREACHES
    ========================================================= */

    const slaBreaches = await TaskModel.count({
      where: {
        ...commonWhere,

        due_date: {
          [Op.lt]: today
        },

        status: {
          [Op.notIn]: ["Completed", "Cancelled"]
        }
      }
    });

    /* =========================================================
        TODAY TASKS
    ========================================================= */

    const todayTasks = await TaskModel.findAll({
      order: [["created_at", "DESC"]],

      where: {
        ...commonWhere,

        created_at: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },

      attributes: ["id", "task_title", "status", "priority", "due_date"]
    });

    /* =========================================================
        WEEKLY PRODUCTIVITY
    ========================================================= */

    const weeklyRaw = await TaskModel.findAll({
      attributes: [
        [fn("DAYNAME", col("created_at")), "day"],

        [fn("COUNT", col("id")), "task"]
      ],

      where: {
        ...commonWhere
      },

      group: [literal("DAYNAME(created_at)")],

      raw: true
    });

    /* =========================================================
        FORMAT WEEKLY DATA
    ========================================================= */

    const weekMap = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun"
    };

    const weeklyProductivity = weeklyRaw.map((item) => ({
      name: weekMap[item.day] || item.day,

      task: Number(item.task)
    }));

    /* =========================================================
        RESPONSE
    ========================================================= */

    return res.status(200).json({
      success: true,

      data: {
        totalTasks,

        completedTasks,

        remainingTasks,

        pendingTasks,

        inProgressTasks,

        overdueTasks,

        slaBreaches,

        workingHours: 186,

        avgResponse: "18 Min",

        acceptedTime: "12 Min",

        revenueImpact: "₹12.5L",

        todayTasks,

        weeklyProductivity
      }
    });
  } catch (error) {
    console.error("EMPLOYEE DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,

      message: error.message
    });
  }
};
