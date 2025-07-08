const { createNotificationByRoleId } = require("../../../helper/SendNotification");
const db = require("../../../models");
const { GrnEntry, RawMaterialQcResult, User , Notification} = db;

// Create GRN Entry
exports.store = async (req, res) => {
  try {
    const data = await GrnEntry.create(req.body);


  await createNotificationByRoleId({
    title: "New Store Entry",
    message: `Store Entry has been successfully created.`,
    role_id: 2
  });

  await createNotificationByRoleId({
  title: "New Qc Store",
  message: "A new store entry has been created. Please verify the material in QC.",
  role_id: 3 // Assuming role_id: 3 belongs to QC team
});
   
    
     

    res.status(201).json({ message: "GRN Entry created successfully", data });
  } catch (error) {
    console.error("Error creating GRN Entry:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.index = async (req, res) => {
  try {
    const entries = await GrnEntry.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: RawMaterialQcResult,
          as: "qc_result",
          required: false,
          attributes: ["tested_by"],
          include: [
            {
              model: User,
              as: "testedBy",
              required: false
            }
          ]
        }
      ]
    });

    res.status(200).json({ message: "GRN Entries fetched", data: entries });
  } catch (error) {
    console.error("Error fetching GRN Entries:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.show = async (req, res) => {
  try {
    const id = req.params.id;
    const entry = await GrnEntry.findOne({
      where: {
        guard_entry_id: id
      }
    });
    if (!entry) return res.status(404).json({ message: "GRN Entry not found" });
    res.status(200).json({ message: "GRN Entry fetch", data: entry });
  } catch (error) {
    console.error("Error fetching GRN Entry:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update GRN Entry
exports.update = async (req, res) => {
  try {
    const entry = await GrnEntry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: "GRN Entry not found" });

    await entry.update(req.body);
    res.status(200).json({ message: "GRN Entry updated", data: entry });
  } catch (error) {
    console.error("Error updating GRN Entry:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete GRN Entry
exports.destroy = async (req, res) => {
  try {
    const entry = await GrnEntry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: "GRN Entry not found" });

    await entry.destroy();
    res.status(200).json({ message: "GRN Entry deleted" });
  } catch (error) {
    console.error("Error deleting GRN Entry:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
