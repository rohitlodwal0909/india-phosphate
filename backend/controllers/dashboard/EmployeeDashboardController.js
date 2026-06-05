const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const { Op, where, fn, col, literal } = require("sequelize");

const { TaskModel, Product, User } = db;

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromDate, toDate } = req.query;

    const today = new Date();

    let dateFilter = {};

    if (fromDate && toDate) {
      dateFilter = {
        created_at: {
          [Op.between]: [
            new Date(`${fromDate}T00:00:00`),
            new Date(`${toDate}T23:59:59`)
          ]
        }
      };
    }

    const commonWhere = {
      [Op.or]: [{ user_id: id }, { assign_to: id }]
    };

    const finalWhere = {
      ...commonWhere,
      ...dateFilter
    };

    /* =========================================================
       COUNTS
    ========================================================= */

    const totalTasks = await TaskModel.count({
      where: finalWhere
    });

    const completedTasks = await TaskModel.count({
      where: {
        ...finalWhere,
        status: "Completed"
      }
    });

    const remainingTasks = await TaskModel.count({
      where: {
        ...finalWhere,
        status: {
          [Op.ne]: "Completed"
        }
      }
    });

    const pendingTasks = await TaskModel.count({
      where: {
        ...finalWhere,
        status: "Pending"
      }
    });

    const inProgressTasks = await TaskModel.count({
      where: {
        ...finalWhere,
        status: "In Progress"
      }
    });

    const overdueTasks = await TaskModel.count({
      where: {
        ...finalWhere,
        due_date: {
          [Op.lt]: today
        },
        status: {
          [Op.ne]: "Completed"
        }
      }
    });

    const slaBreaches = await TaskModel.count({
      where: {
        ...finalWhere,
        due_date: {
          [Op.lt]: today
        },
        status: {
          [Op.notIn]: ["Completed", "Cancelled"]
        }
      }
    });

    /* =========================================================
       TASK LIST
    ========================================================= */

    const todayTasks = await TaskModel.findAll({
      where: finalWhere,
      attributes: [
        "id",
        "task_title",
        "status",
        "priority",
        "due_date",
        "created_at"
      ],
      order: [["created_at", "DESC"]]
    });

    /* =========================================================
       PRODUCTIVITY GRAPH
    ========================================================= */

    const weeklyRaw = await TaskModel.findAll({
      attributes: [
        [fn("DATE", col("created_at")), "date"],
        [fn("COUNT", col("id")), "task"]
      ],
      where: finalWhere,
      group: [literal("DATE(created_at)")],
      order: [[literal("DATE(created_at)"), "ASC"]],
      raw: true
    });

    const weeklyProductivity = weeklyRaw.map((item) => ({
      name: item.date,
      task: Number(item.task)
    }));

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
        weeklyProductivity,
        selectedRange: {
          fromDate,
          toDate
        }
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

exports.getPendingTask = async (req, res) => {
  try {
    const { id } = req.params;

    const pendingtasks = await TaskModel.findAll({
      where: {
        status: "pending",
        [Op.or]: [
          {
            user_id: id
          },
          {
            assign_to: id
          }
        ]
      },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          as: "assign_task",
          attributes: ["username"]
        }
      ]
    });

    return res.status(200).json({
      success: true,
      data: pendingtasks
    });
  } catch (error) {
    console.error("PENDING TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
