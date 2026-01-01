const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { DepartmentMaster, User } = db;

// Create Department
exports.createDepartmentMaster = async (req, res, next) => {
  try {
    const { department_name, description, hod, status, created_by } = req.body;

    // Step 1: Auto-generate department_code
    const lastDepartment = await DepartmentMaster.findOne({
      order: [["created_at", "DESC"]]
    });

    let nextDepartmentCode = "DEPT-0001"; // default
    if (lastDepartment && lastDepartment.department_code) {
      const lastNumber = parseInt(lastDepartment.department_code.split("-")[1]);
      const newNumber = (lastNumber + 1).toString().padStart(4, "0");
      nextDepartmentCode = `DEPT-${newNumber}`;
    }

    // Step 2: Create new department entry
    const newDepartment = await DepartmentMaster.create({
      department_code: nextDepartmentCode,
      department_name,
      description,
      hod,
      status,
      created_by
    });

    // Step 3: Log creation
    const user_id = created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Department code '${nextDepartmentCode}' was created by '${username}' on ${entry_date} at ${entry_time}.`;

    await createLogEntry({ user_id, message: logMessage });

    // Step 4: Send response
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error("Create Department Error:", error);
    next(error);
  }
};

exports.getDepartmentMasterById = async (req, res, next) => {
  try {
    const DepartmentMasters = await DepartmentMaster.findByPk(req.params.id);
    if (!DepartmentMasters) {
      const error = new Error("Department entry not found");
      error.status = 404;
      return next(error);
    }

    res.json(DepartmentMasters);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllDepartmentMaster = async (req, res, next) => {
  try {
    const departmentList = await DepartmentMaster.findAll({
      where: { deleted_at: null },
      order: [["created_at", "DESC"]]
    });

    const resultWithUsernames = await Promise.all(
      departmentList.map(async (dept) => {
        const user = await User.findOne({
          where: { id: dept.created_by },
          attributes: ["username"]
        });

        return {
          ...dept.toJSON(),
          created_by_username: user?.username || null
        };
      })
    );

    res.status(200).json(resultWithUsernames);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateDepartmentMaster = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Find department by primary key
    const department = await DepartmentMaster.findByPk(id);

    if (!department) {
      const error = new Error("Department entry not found.");
      error.status = 404;
      return next(error);
    }

    // Destructure fields from request body
    const {
      department_code,
      department_name,
      description,
      hod,
      status,
      created_by
    } = req.body;

    // Update department
    await department.update({
      department_code,
      department_name,
      description,
      hod,
      status,
      created_by
    });

    const user_id = req.body.created_by || department?.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Department  code '${department_code}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    // Return updated object
    res.status(200).json(department);
  } catch (error) {
    console.error("Update DepartmentMaster Error:", error);
    next(error);
  }
};

// Delete
exports.deleteDepartmentMaster = async (req, res, next) => {
  try {
    const DepartmentMasters = await DepartmentMaster.findByPk(req.params.id);

    if (!DepartmentMasters) {
      const error = new Error("Department entry not found");
      error.status = 404;
      return next(error);
    }
    const user_id = req.body.user_id || DepartmentMasters?.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";

    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Department  code '${DepartmentMasters?.department_code}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await DepartmentMasters.destroy();
    res.json({ message: "Department Master entry deleted" });
  } catch (error) {
    next(error);
  }
};
