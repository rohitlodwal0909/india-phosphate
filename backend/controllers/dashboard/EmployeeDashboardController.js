const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const { Op, fn, col, literal, Sequelize, where } = require("sequelize");
const { getISTDateTime } = require("../../helper/dateTimeHelper");

const { TaskModel, Product, User } = db;
// mj

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
          [Op.notIn]: ["Completed", "Cancelled", "Pending"]
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
      where: { ...finalWhere, status: "Pending" },
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

    const avgAcceptedTime = await TaskModel.findOne({
      attributes: [[fn("AVG", col("accepted_time")), "avgAcceptedTime"]],
      where: finalWhere,
      raw: true
    });

    const avgFirstResponse = await TaskModel.findOne({
      attributes: [[fn("AVG", col("first_response")), "avgFirstResponse"]],
      where: finalWhere,
      raw: true
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

    const { entry_date, entry_time } = getISTDateTime();

    const user = await User.findOne({
      where: { id: id }
    });

    let workingHours = "0 hr 0 min";

    if (user?.login_time) {
      const loginDateTime = new Date(
        user.login_time.replace(
          /^(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})$/,
          "$1T$2"
        )
      );

      const currentDateTime = new Date();

      const totalMinutes = Math.floor(
        (currentDateTime.getTime() - loginDateTime.getTime()) / (1000 * 60)
      );

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      // yahan const hata do
      workingHours = `${hours} hr ${minutes} min`;
    }

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
        workingHours: workingHours,
        avgResponse: avgFirstResponse?.avgFirstResponse,
        acceptedTime: avgAcceptedTime?.avgAcceptedTime,
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

exports.getRemainingTask = async (req, res) => {
  try {
    const { id } = req.params;

    const remainingTaskList = await TaskModel.findAll({
      where: {
        status: {
          [Op.ne]: "Completed"
        },
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
      data: remainingTaskList
    });
  } catch (error) {
    console.error("PENDING TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
