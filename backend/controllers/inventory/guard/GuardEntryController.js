const db = require("../../../models");
const { GuardEntry } = db;
exports.store = async (req, res) => {
  const {
    user_id,
    guard_type,
    product_name,
    product_id,
    quantity_net,
    quantity_unit,
    sender_name,
    vehicle_number,
    remark
  } = req.body;

  // Generate current date and time
  const now = new Date();
  const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
  const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

  try {
    // Find the latest inward_number to increment
    const latestEntry = await GuardEntry.findOne({
      order: [["created_at", "DESC"]]
    });

    let nextNumber = 1;

    if (latestEntry && latestEntry.inward_number) {
      const lastNum = parseInt(latestEntry.inward_number.replace("INW-", ""));
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }

    const inward_number = `INW-${nextNumber.toString().padStart(4, "0")}`;

    const newEntry = await GuardEntry.create({
      user_id,
      guard_type,
      product_name,
      product_id,
      quantity_net,
      quantity_unit,
      sender_name,
      vehicle_number,
      inward_number,
      entry_date,
      entry_time,
      remark
    });

    res.status(201).json({
      message: "Guard Entry created successfully",
      data: newEntry
    });
  } catch (error) {
    console.error("Error in Guard Entry Store:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.guardEntry = async (req, res) => {
  try {
    const entries = await GuardEntry.findAll({
      order: [
        ["entry_date", "DESC"],
        ["entry_time", "DESC"]
      ]
    });

    res.status(200).json({
      message: "All Guard Entries fetched successfully",
      data: entries
    });
  } catch (error) {
    console.error("Error in Guard Entry Fetch:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete Guard Entry
exports.deleteGuardEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const entry = await GuardEntry.findByPk(id);

    if (!entry) {
      return res.status(404).json({ message: "Guard Entry not found" });
    }

    await entry.destroy();

    res.status(200).json({ message: "Guard Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting Guard Entry:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update Guard Entry
exports.updateGuardEntry = async (req, res) => {
  const { id } = req.params;
  const {
    inward_number,
    vehicle_number,
    quantity_net,
    guard_type,
    product_name,
    product_id,
    sender_name,
    quantity_unit
  } = req.body;

  try {
    const entry = await GuardEntry.findByPk(id);

    if (!entry) {
      return res.status(404).json({ message: "Guard Entry not found" });
    }

    // Auto-generate current date and time on update
    const now = new Date();
    const entry_date = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const entry_time = now.toTimeString().split(" ")[0]; // HH:mm:ss

    await entry.update({
      inward_number,
      vehicle_number,
      quantity_net,
      guard_type,
      product_name,
      product_id,
      sender_name,
      quantity_unit,
      entry_date,
      entry_time
    });

    res.status(200).json({
      message: "Guard Entry updated successfully",
      data: entry
    });
  } catch (error) {
    console.error("Error updating Guard Entry:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
