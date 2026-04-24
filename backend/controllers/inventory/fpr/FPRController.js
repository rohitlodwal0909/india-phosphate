const db = require("../../../models");
const { Qcbatch, BatchReleaseModel, Finishing, FinishQty } = db;

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
    const { batch_id, release_no, release_date } = req.body;
    const user_id = req.admin?.id;

    // ✅ Validation
    if (!batch_id || !release_no || !release_date || !user_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Check if batch exists
    const batch = await Qcbatch.findByPk(batch_id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    // ✅ Find by batch_id (correct)
    const batchRelease = await BatchReleaseModel.findOne({
      where: { batch_id }
    });

    if (!batchRelease) {
      // ✅ Create new
      await BatchReleaseModel.create({
        batch_id,
        release_no,
        release_date,
        user_id
      });
    } else {
      // ✅ Update existing
      await batchRelease.update({
        release_no,
        release_date,
        user_id
      });
    }

    res.status(200).json({
      message: "FPR details saved successfully"
    });
  } catch (error) {
    console.error("Error saving FPR:", error);
    next(error);
  }
};
