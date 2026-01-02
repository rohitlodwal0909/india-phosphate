const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const { createLogEntry } = require("../../../helper/createLogEntry");
const db = require("../../../models");
const { Qcbatch, BatchReleaseModel, Finishing } = db;

exports.index = async (req, res, next) => {
  try {
    const entries = await Qcbatch.findAll({
      where: {
        status: "Approved"
      },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: BatchReleaseModel,
          as: "batch_releases",
          required: false
        },
        {
          model: Finishing,
          as: "finishing",
          required: false
        }
      ]
    });

    res.status(200).json({ message: "Approved Batch fetched", data: entries });
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    const { batch_id, release_no, release_date, user_id } = req.body;

    // ✅ Validation
    if (!batch_id || !release_no || !release_date || !user_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Check if batch exists
    const batch = await Qcbatch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    // ✅ Save FPR record
    const entry = await BatchReleaseModel.create({
      batch_id,
      release_no,
      release_date,
      user_id
    });

    res.status(200).json({
      message: "FPR details saved successfully",
      data: entry
    });
  } catch (error) {
    console.error("Error saving FPR:", error);
    next(error);
  }
};
