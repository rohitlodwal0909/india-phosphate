const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { StaffMaster,User} = db;

// Create
exports.createStaffMaster = async (req, res,next) => {
  try {
    const {
      full_name,
      email,
      mobile_number,
      date_of_birth,
      gender,
      address,
      joining_date,
      designation_id,
      qualification_id,

      status,        // Optional
    } = req.body;
  
    const existingStaff = await StaffMaster.findOne({ where: { email } });
    if (existingStaff) {
       const error = new Error("A staff member with this email already exists.");
       error.status = 400;
      return next(error)
   
    }
    const profileImageFile = req.file;
    const profileImagePath = profileImageFile ?`/uploads/${profileImageFile.filename}` : ""
   
    // Create new staff entry
    const newStaff = await StaffMaster.create({
      full_name,
      email,
      mobile_number,
      date_of_birth,
      gender,
      address,
      joining_date,
      designation_id,
      qualification_id,
      profile_photo: profileImagePath || null,
      status: status || "Inactive" ,
    });

    return res.status(201).json(newStaff);
  } catch (error) {
   next(error);
  }
};
exports.getStaffMasterById = async (req, res,next) => {
  try {
    const StaffMasters = await StaffMaster.findByPk(req.params.id);
    if (!StaffMasters)
    {
      const error = new Error("Staff member not found");
       error.status = 404;
      return next(error)
    }

    res.json(StaffMasters);
  } catch (error) {
   next(error)
  }
};

// Read By ID
exports.getAllStaffMaster = async (req, res,next) => {
  try {
    const StaffMasters = await StaffMaster.findAll({
      where: {
        deleted_at: null // optional: exclude soft-deleted records
      },
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(StaffMasters);
  } catch (error) {
    next(error)
  }
};


// Update
exports.updateStaffMaster = async (req, res,next) => {
  try {
    const staff = await StaffMaster.findByPk(req.params.id);
    if (!staff) {
       const error = new Error("Staff member not found");
       error.status = 404;
      return next(error)
    }

  const profileImageFile = req.file;
    const profileImagePath = profileImageFile ?`/uploads/${profileImageFile.filename}` : staff?.profile_photo

    const {
      full_name,
      email,
      mobile_number,
      date_of_birth,
      gender,
      address,
      joining_date,
      designation_id,
      qualification_id,
      profile_photo, // optional
      status  ,
      password , 
      confirm_password       // optional
    } = req.body;

    await staff.update({
      full_name,
      email,
      mobile_number,
      date_of_birth,
      gender,
      address,
      joining_date,
      designation_id,
      qualification_id,
      profile_photo: profileImagePath ? profileImagePath : profile_photo ,
      status: status || staff.status,
      updated_at: new Date(),
      confirm_password,
      password
    });

    return res.json(staff);
  } catch (error) {
next(error)
  }
};


// Delete
exports.deleteStaffMaster = async (req, res,next) => {
  try {
    const StaffMasters = await StaffMaster.findByPk(req.params.id);
    if (!StaffMasters)
    {  const error = new Error("Staff member not found");
       error.status = 404;
      return next(error)
    }
    await StaffMasters.destroy();
    res.json({ message: "StaffMaster entry deleted" });
  } catch (error) {
  next(error)
  }
};