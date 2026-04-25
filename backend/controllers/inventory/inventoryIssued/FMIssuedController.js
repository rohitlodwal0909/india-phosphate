const { where, Sequelize } = require("sequelize");
const {
  createNotificationByRoleId
} = require("../../../helper/SendNotification");
const db = require("../../../models");
const { getISTDateTime } = require("../../../helper/dateTimeHelper");

const {
  Qcbatch,
  Finishing,
  FinishQty,
  PMIssueModel,
  FMIssuedModel,
  BatchReleaseModel
} = db;

exports.getBatches = async (req, res, next) => {
  try {
    const data = await Qcbatch.findAll({
      where: { status: "Approved" },
      include: [
        {
          model: Finishing,
          as: "finishing",
          required: true,
          include: [
            {
              model: FinishQty,
              required: false
            },
            {
              model: FMIssuedModel,
              required: false
            }
          ]
        },
        {
          model: BatchReleaseModel,
          as: "batch_releases",
          required: true
        }
      ],
      order: [["created_at", "DESC"]]
    });

    const formattedData = data
      .map((batch) => {
        const batchJSON = batch.toJSON();

        /* =====================
           TOTAL FINISH QTY
        ===================== */
        const totalFinishQty =
          batchJSON?.finishing?.FinishQties?.reduce(
            (sum, item) => sum + Number(item.finishing_qty || 0),
            0
          ) || 0;

        /* =====================
           TOTAL ISSUED QTY
        ===================== */
        const totalIssuedQty =
          batchJSON?.finishing?.FMIssuedModels?.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
          ) || 0;

        const remainingQty = totalFinishQty - totalIssuedQty;

        return {
          ...batchJSON,
          total_finish_qty: totalFinishQty,
          total_issued_qty: totalIssuedQty,
          remaining_qty: remainingQty
        };
      })

      // ✅ ONLY AVAILABLE BATCHES
      .filter((batch) => batch.remaining_qty > 0);

    res.status(200).json({
      message: "Batches Fetched",
      data: formattedData
    });
  } catch (error) {
    next(error);
  }
};

exports.getFinishedStock = async (req, res, next) => {
  try {
    const data = await Qcbatch.findAll({
      attributes: ["id", "product_name"],
      include: [
        {
          model: Finishing,
          as: "finishing",
          attributes: ["id"],
          required: true,
          include: [
            {
              model: FinishQty,
              attributes: [
                "id",
                "finish_id",
                "finishing_qty",
                "unfinishing_qty"
              ],
              required: false
            },
            {
              model: FMIssuedModel,
              attributes: ["id", "quantity", "finish_id"],
              required: false
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    // ✅ STEP 1: Batch-wise calculation
    const formattedData = data.map((batch) => {
      const batchJSON = batch.toJSON();

      const totalFinishQty =
        batchJSON?.finishing?.FinishQties?.reduce(
          (sum, item) => sum + Number(item.finishing_qty || 0),
          0
        ) || 0;

      const totalIssuedQty =
        batchJSON?.finishing?.FMIssuedModels?.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        ) || 0;

      const remainingQty = totalFinishQty - totalIssuedQty;

      return {
        product_name: batchJSON.product_name,
        remaining_qty: remainingQty
      };
    });

    const finalData = formattedData.filter((item) => item.remaining_qty > 0);

    // ✅ STEP 2: Group by product_name

    res.status(200).json({
      message: "Product-wise Stock Fetched",
      data: finalData
    });
  } catch (error) {
    next(error);
  }
};

exports.saveIssuedFM = async (req, res, next) => {
  try {
    const { finish_id, issued_qty, work_order_no, remark } = req.body;
    const { entry_date, entry_time } = getISTDateTime();

    const data = await FMIssuedModel.create({
      finish_id: finish_id,
      quantity: issued_qty,
      work_order_no: work_order_no,
      remark: remark,
      date: entry_date + entry_time,
      user_id: req.admin.id
    });
    res.status(201).json({
      message: "FM issued successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};

exports.getIssueFM = async (req, res, next) => {
  try {
    const data = await Qcbatch.findAll({
      include: [
        {
          model: Finishing,
          as: "finishing",
          required: true,
          include: [
            {
              model: FinishQty,
              required: true
            },
            {
              model: FMIssuedModel,
              required: true
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    const formattedData = data.map((batch) => {
      const batchJSON = batch.toJSON();

      /* ==============================
         TOTAL FINISH QTY
      ============================== */
      const totalFinishQty =
        batchJSON?.finishing?.FinishQties?.reduce(
          (sum, item) => sum + Number(item.finishing_qty || 0),
          0
        ) || 0;

      /* ==============================
         TOTAL ISSUED FM QTY
      ============================== */
      const totalIssuedQty =
        batchJSON?.finishing?.FMIssuedModels?.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        ) || 0;

      /* ==============================
         REMAINING QTY (ERP Logic)
      ============================== */
      const remainingQty = totalFinishQty - totalIssuedQty;

      return {
        ...batchJSON,
        total_finish_qty: totalFinishQty,
        total_issued_qty: totalIssuedQty,
        remaining_qty: remainingQty
      };
    });

    res.status(200).json({
      message: "Issued FM Fetched",
      data: formattedData
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteIssuedFM = async (req, res, next) => {
  try {
    const finish_id = req.params.id;

    const deletedCount = await FMIssuedModel.destroy({
      where: { finish_id: finish_id } // ✅ match all
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        message: "No FM Issued records found for this finish_id"
      });
    }

    res.status(200).json({
      message: `${deletedCount} record(s) deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

exports.returnPM = async (req, res, next) => {
  try {
    const { id, return_bag, returned_by } = req.body;

    const entry = await PMIssueModel.findByPk(id);

    if (!entry) {
      return res.status(404).json({
        message: "Equipment issue entry not found"
      });
    }

    // total issued quantity
    const issuedQty = entry.quantity;
    const alreadyReturned = entry.return_bag || 0;

    // validation
    if (return_bag < alreadyReturned) {
      return res.status(400).json({
        message:
          "Returned quantity cannot be less than already returned quantity"
      });
    }

    if (return_bag > issuedQty) {
      return res.status(400).json({
        message: "Returned quantity cannot be greater than issued quantity"
      });
    }

    const newlyReturned = return_bag - alreadyReturned;

    // nothing new to return
    if (newlyReturned === 0) {
      return res.status(200).json({
        message: "No new equipment returned",
        data: entry
      });
    }

    await entry.update({
      return_bag,
      returned_by
    });

    res.status(200).json({
      message: "PM returned successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};

exports.updateIssuedPM = async (req, res, next) => {
  try {
    const { id } = req.body; // 🔑 id from URL
    const entry = await PMIssueModel.findByPk(id);

    if (!entry) {
      const error = new Error("PM issue entry not found");
      error.status = 404;
      return next(error);
    }

    await entry.update({
      ...req.body
    });

    res.status(200).json({
      message: "PM issue updated successfully",
      data: entry
    });
  } catch (error) {
    next(error);
  }
};
