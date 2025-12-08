const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { StaffMaster, User } = db;

// Create
exports.createStaffMaster = async (req, res, next) => {
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
      department,
      kyc_details,
      created_by,
      status // Optional
    } = req.body;

    const existingStaff = await StaffMaster.findOne({ where: { email } });
    if (existingStaff) {
      const error = new Error("A staff member with this email already exists.");
      error.status = 400;
      return next(error);
    }
    const profileImageFile = req.file;
    const profileImagePath = profileImageFile
      ? `/uploads/${profileImageFile.filename}`
      : "";

    const user_id = req.body.created_by || created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Staff name '${full_name}' was created by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
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
      department,
      kyc_details,
      profile_photo: profileImagePath || null,
      status: status || "Inactive",
      created_by
    });

    return res.status(201).json(newStaff);
  } catch (error) {
    next(error);
  }
};
exports.getStaffMasterById = async (req, res, next) => {
  try {
    const StaffMasters = await StaffMaster.findByPk(req.params.id);
    if (!StaffMasters) {
      const error = new Error("Staff member not found");
      error.status = 404;
      return next(error);
    }

    res.json(StaffMasters);
  } catch (error) {
    next(error);
  }
};

// Read By ID
exports.getAllStaffMaster = async (req, res, next) => {
  try {
    const StaffMasters = await StaffMaster.findAll({
      where: {
        deleted_at: null // optional: exclude soft-deleted records
      },
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(StaffMasters);
  } catch (error) {
    next(error);
  }
};

// Update
exports.updateStaffMaster = async (req, res, next) => {
  try {
    const staff = await StaffMaster.findByPk(req.params.id);
    if (!staff) {
      const error = new Error("Staff member not found");
      error.status = 404;
      return next(error);
    }

    const profileImageFile = req.file;
    const profileImagePath = profileImageFile
      ? `/uploads/${profileImageFile.filename}`
      : staff?.profile_photo;

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
      department,
      kyc_details,
      profile_photo, // optional
      status,
      password,
      confirm_password,
      created_by // optional
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
      department,
      kyc_details,
      profile_photo: profileImagePath ? profileImagePath : profile_photo,
      status: status || staff.status,
      updated_at: new Date(),
      confirm_password,
      password,
      created_by
    });

    const user_id = created_by || staff.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Staff name '${staff?.full_name}' was updated by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    return res.json(staff);
  } catch (error) {
    next(error);
  }
};

// Delete
exports.deleteStaffMaster = async (req, res, next) => {
  try {
    const StaffMasters = await StaffMaster.findByPk(req.params.id);
    if (!StaffMasters) {
      const error = new Error("Staff member not found");
      error.status = 404;
      return next(error);
    }

    const user_id = req?.body?.user_id || StaffMasters.created_by;
    const user = await User.findByPk(user_id);
    const username = user ? user.username : "Unknown User";
    // Step 4: Create log
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0];
    const entry_time = now.toTimeString().split(" ")[0];
    const logMessage = `Staff name '${StaffMasters?.full_name}' was deleted by '${username}' on ${entry_date} at ${entry_time}.`;
    await createLogEntry({ user_id: user_id, message: logMessage });
    await StaffMasters.destroy();
    res.json({ message: "Staff Master entry deleted" });
  } catch (error) {
    next(error);
  }
};
