const db = require("../../../models");
const { Qcbatch, BatchReleaseModel, Finishing, FinishQty } = db;
const sequelize = db.sequelize;

exports.index = async (req, res, next) => {
  try {
    const entries = await Qcbatch.findAll({
      where: { status: "Approved" },
      order: [["created_at", "DESC"]],
      include: [{
        model: BatchReleaseModel,
        as: "batch_releases",
        required: false,
        attributes: { exclude: ["createdAt", "updatedAt"] }
      }, {
        model: db.ProductionResult,
        as: "production_results",
        required: false,
        include: [{
          model: Finishing,
          as: "finishing_entries",
          required: false,
          include: [{ model: FinishQty, required: false }]
        }]
      }]
    });

    const resultData = entries.map((entry) => {
      const batch = entry.toJSON();
      const finishingEntries = (batch.production_results || []).flatMap((production) => production.finishing_entries || []);
      batch.actual_batch_quantity = finishingEntries.reduce((sum, finish) => {
        const latest = [...(finish.FinishQties || [])].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime() || Number(b.id) - Number(a.id)
        )[0];
        return sum + Number(latest?.finishing_qty || 0);
      }, 0);
      return batch;
    });

    return res.status(200).json({
      success: true,
      message: "Approved Batch fetched successfully",
      data: resultData
    });
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { batch_id, release_no, release_date, quantity } = req.body;
    const user_id = req.admin?.id;
    const releaseQuantity = Number(quantity);

    if (!batch_id || !release_no || !release_date || !user_id || !Number.isFinite(releaseQuantity) || releaseQuantity <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Batch, release number, release date, and a positive quantity are required." });
    }

    const batch = await Qcbatch.findByPk(batch_id, {
      transaction,
      lock: transaction.LOCK.UPDATE
    });
    if (!batch) {
      await transaction.rollback();
      return res.status(404).json({ message: "Batch not found." });
    }

    const finishingEntries = await Finishing.findAll({
      where: { batch_number: String(batch.id) },
      include: [{ model: FinishQty, required: false }],
      transaction
    });
    const actualBatchQuantity = finishingEntries.reduce((sum, finishingEntry) => {
      const latest = [...(finishingEntry.FinishQties || [])].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime() || Number(b.id) - Number(a.id)
      )[0];
      return sum + Number(latest?.finishing_qty || 0);
    }, 0);
    if (!Number.isFinite(actualBatchQuantity) || actualBatchQuantity <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Actual batch quantity could not be read from the batch size." });
    }

    const previousReleases = await BatchReleaseModel.findAll({
      where: { batch_id },
      attributes: ["quantity"],
      transaction
    });
    // Legacy FPR rows had no quantity field and represented full-batch release.
    const alreadyReleased = previousReleases.reduce(
      (sum, release) => sum + (release.quantity == null ? actualBatchQuantity : Number(release.quantity)),
      0
    );
    const remainingQuantity = actualBatchQuantity - alreadyReleased;
    if (releaseQuantity > remainingQuantity) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Release quantity exceeds the remaining batch quantity (${Math.max(remainingQuantity, 0)}).`
      });
    }

    const batchRelease = await BatchReleaseModel.create({
      batch_id,
      release_no,
      release_date,
      quantity: releaseQuantity,
      user_id
    }, { transaction });

    await transaction.commit();
    return res.status(201).json({
      message: "FPR details saved successfully",
      data: batchRelease,
      remaining_quantity: remainingQuantity - releaseQuantity
    });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    next(error);
  }
};
