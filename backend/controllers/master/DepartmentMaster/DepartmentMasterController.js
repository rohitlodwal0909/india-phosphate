const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { DepartmentMaster, User} = db;


// Create Department
exports.createDepartmentMaster = async (req, res, next) => {
  try {
    const {
      department_code,
      department_name,
      description,
      hod,
      status,
      created_by
    } = req.body;

    // Check for duplicate department_code
    const existingDepartment = await DepartmentMaster.findOne({ where: { department_code } });
    if (existingDepartment) {
      const error = new Error("A department with this code already exists.");
      error.status = 400;
      return next(error);
    }

    // Create new department entry
    const newDepartment = await DepartmentMaster.create({
      department_code,
      department_name,
      description,
      hod,
      status,
      created_by
    });

    res.status(201).json(newDepartment);
  } catch (error) {
    next(error);
  }
};


exports.getDepartmentMasterById = async (req, res,next) => {
  try {
    const DepartmentMasters = await DepartmentMaster.findByPk(req.params.id);
    if (!DepartmentMasters){
       const error = new Error( "Department entry not found" );
       error.status = 404;
      return next(error); 
     }
   

    res.json(DepartmentMasters);
  } catch (error) {
  next(error)
  }
};

// Read By ID
exports.getAllDepartmentMaster = async (req, res, next) => {
  try {
    const departmentList = await DepartmentMaster.findAll({
      where: { deleted_at: null },
      order: [['created_at', 'DESC']],
    });

    const resultWithUsernames = await Promise.all(
      departmentList.map(async (dept) => {
        const user = await User.findOne({
          where: { id: dept.created_by },
          attributes: ['username'],
        });

        return {
          ...dept.toJSON(),
          created_by_username: user?.username || null,
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

    // Return updated object
    res.status(200).json(department);
  } catch (error) {
    console.error("Update DepartmentMaster Error:", error);
    next(error);
  }
};



// Delete
exports.deleteDepartmentMaster = async (req, res,next) => {
  try {
    const DepartmentMasters = await DepartmentMaster.findByPk(req.params.id);

    if (!DepartmentMasters){ const error = new Error( "Department entry not found" );
       error.status = 404;
      return next(error); 
     }
      
    await DepartmentMasters.destroy();
    res.json({ message: "DepartmentMaster entry deleted" });
  } catch (error) {
   next(error)
  }
};