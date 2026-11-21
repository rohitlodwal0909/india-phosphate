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

const openingStock = {
  "26CCM10": 400,
  "26DCPA74": 600,
  "26DSPD014": 150,
  "26AMCL12": 25,
  "26CC04": 75,
  "26CAA76": 1200,
  "26DCP223": 775,
  "26DSPD03": 1125,
  "26IPC29": 2925,
  "26DSPD01": 700,
  "26PC14": 500,
  "26FF72": 250,
  "26FAC16": 700,
  "26MSPD03": 3300,
  "26ZSM22": 275,
  "26KCL180": 1050,
  "26CAC19": 2600,
  "26CCN06": 125,
  "26CCM02": 475,
  "26CAC102": 775,
  "26CSA05": 325,
  "26AMC104": 375,
  "26KCL165": 1050,
  "26NACL85": 150,
  "26KCL161": 1600,
  "26FAC02": 475,
  "26ZSM18": 700,
  "26MS07": 100,
  "26CC09": 150,
  "26DCPA51": 300,
  "26CAA62": 750,
  "26CAA69": 1000,
  "26DSC23": 1275,
  "26CSA04": 875,
  "26DCP186": 2750,
  "26DCP185": 3250,
  "26DCP187": 1725,
  "26DCPD61": 475,
  "26DCPDS33": 1475,
  "26DCPDS30": 400,
  "26CAC36": 1875,
  "26DCPDS31": 875,
  "26DCPDS29": 300,
  "26DCPDS21": 550,
  "26DCPDS22": 750
};

const getActualFinishedQuantity = (batch) => {
  const quantities = batch.finishing?.FinishQties || [];
  const latest = quantities.reduce((current, item) => {
    if (!current) return item;
    return new Date(item.created_at).getTime() > new Date(current.created_at).getTime() ? item : current;
  }, null);
  return Number(latest?.finishing_qty || 0);
};

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

    const formattedData = [];
    const existingBatchs = new Set();

    for (const batch of data) {
      const batchJSON = batch.toJSON();

      const releasedQty = (batchJSON.batch_releases || []).reduce(
        (sum, release) => sum + (release.quantity == null ? getActualFinishedQuantity(batchJSON) : Number(release.quantity)),
        0
      );

      const totalIssuedQty =
        batchJSON.finishing?.FMIssuedModels?.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        ) || 0;

      // 👇 Apne actual field ka naam use kare
      const batchNo = (batchJSON.qc_batch_number || "").trim().toUpperCase();

      existingBatchs.add(batchNo);

      const openingQty = openingStock[batchNo] || 0;

      const remainingQty = releasedQty + openingQty - totalIssuedQty;

      if (remainingQty > 0) {
        formattedData.push({
          ...batchJSON,
          opening_stock: openingQty,
          total_finish_qty: releasedQty,
          total_issued_qty: totalIssuedQty,
          remaining_qty: remainingQty,
          is_opening_stock: false
        });
      }
    }

    // =============================
    // Add Opening Stock batches
    // which are not available in DB
    // =============================

    for (const [batchNo, qty] of Object.entries(openingStock)) {
      if (!existingBatchs.has(batchNo)) {
        formattedData.push({
          id: null,
          qc_batch_number: batchNo,
          opening_stock: qty,
          total_finish_qty: 0,
          total_issued_qty: 0,
          remaining_qty: qty,
          is_opening_stock: true,
          finishing: null,
          batch_releases: []
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Batches Fetched Successfully",
      data: formattedData
    });
  } catch (error) {
    console.error("getBatches Error:", error);
    next(error);
  }
};

exports.getFinishedStock = async (req, res, next) => {
  try {
    const data = await Qcbatch.findAll({
      attributes: ["id", "product_name", "qc_batch_number", "size"],
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
        }, {
          model: BatchReleaseModel,
          as: "batch_releases",
          required: false,
          attributes: ["id", "quantity"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    // ✅ STEP 1: Batch-wise calculation
    const dbStock = data
      .map((batch) => {
        const batchJSON = batch.toJSON();

        const releasedQty = (batchJSON.batch_releases || []).reduce(
          (sum, release) => sum + (release.quantity == null ? getActualFinishedQuantity(batchJSON) : Number(release.quantity)),
          0
        );

        const totalIssuedQty =
          batchJSON.finishing?.FMIssuedModels?.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
          ) || 0;

        const remainingQty = releasedQty - totalIssuedQty;

        return {
          batch_no: (batchJSON.qc_batch_number || "").trim().toUpperCase(),
          product_name: batchJSON.product_name,
          remaining_qty: remainingQty
        };
      })
      .filter((item) => item.remaining_qty > 0);

    const stockMap = {};

    Object.entries(openingStock).forEach(([batch, qty]) => {
      stockMap[batch.toUpperCase()] = {
        batch_no: batch.toUpperCase(),
        product_name: "",
        remaining_qty: qty
      };
    });

    // Add DB Stock
    dbStock.forEach((item) => {
      const batch = item.batch_no;

      if (stockMap[batch]) {
        stockMap[batch].remaining_qty += item.remaining_qty;

        if (!stockMap[batch].product_name) {
          stockMap[batch].product_name = item.product_name;
        }
      } else {
        stockMap[batch] = {
          batch_no: batch,
          product_name: item.product_name,
          remaining_qty: item.remaining_qty
        };
      }
    });

    const finalData = Object.values(stockMap).sort((a, b) =>
      a.batch_no.localeCompare(b.batch_no)
    );
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
      // const totalFinishQty =
      //   batchJSON?.finishing?.FinishQties?.reduce(
      //     (sum, item) => sum + Number(item.finishing_qty || 0),
      //     0
      //   ) || 0;

      const finishQtyList = batchJSON.finishing?.FinishQties || [];

      const totalFinishQty =
        finishQtyList.length > 0
          ? Number(finishQtyList[finishQtyList.length - 1].finishing_qty || 0)
          : 0;

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

exports.getDispatchBatch = async (req, res, next) => {
  try {
    const data = await Qcbatch.findAll({
      attributes: ["id", "qc_batch_number", "product_name"],
      include: [
        {
          model: Finishing,
          as: "finishing",
          attributes: ["id"],
          required: true,
          include: [
            {
              model: FMIssuedModel,
              attributes: ["quantity", "work_order_no"],
              required: true
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]],
      raw: true,
      nest: true
    });

    // ✅ GROUP BY WORK ORDER
    const groupedData = {};

    data.forEach((item) => {
      const workOrder = item.finishing.FMIssuedModels.work_order_no;

      if (!groupedData[workOrder]) {
        groupedData[workOrder] = {
          work_order_no: workOrder,
          batches: []
        };
      }

      groupedData[workOrder].batches.push({
        id: item.id,
        qc_batch_number: item.qc_batch_number,
        product_name: item.product_name,
        quantity: item.finishing.FMIssuedModels.quantity
      });
    });

    res.status(200).json({
      message: "Dispatch Batch Grouped",
      data: Object.values(groupedData)
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
