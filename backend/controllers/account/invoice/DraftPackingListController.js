const db = require("../../../models");
const fs = require("fs");

const { DraftPackingListModel } = db;

/* ======================================================
   CREATE DRAFT PACKING LIST
====================================================== */
exports.createDraftPackingList = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Excel file is required"
      });
    }

    const filePath = req.file.path;

    const data = await DraftPackingListModel.create({
      user_id: req.admin.id,
      name: req.body.name,
      file: filePath
    });

    return res.status(200).json({
      message: "Draft Packing List uploaded successfully",
      data
    });
  } catch (error) {
    console.error("Create Error:", error);

    return res.status(500).json({
      message: "Upload failed"
    });
  }
};

/* ======================================================
   UPDATE DRAFT PACKING LIST
====================================================== */
exports.updateDraftPackingList = async (req, res) => {
  try {
    const { id } = req.params;

    const draftPackingList = await DraftPackingListModel.findByPk(id);

    if (!draftPackingList) {
      return res.status(404).json({
        message: "Draft Packing List not found"
      });
    }

    let filePath = draftPackingList.file;

    /* ---------- Replace File If Uploaded ---------- */
    if (req.file) {
      // delete old file safely
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      filePath = req.file.path;
    }

    await draftPackingList.update({
      name: req.body.name,
      file: filePath,
      user_id: req.admin.id
    });

    return res.status(200).json({
      message: "Draft Packing List updated successfully",
      data: draftPackingList
    });
  } catch (error) {
    console.error("Update Error:", error);

    return res.status(500).json({
      message: "Update failed"
    });
  }
};

/* ======================================================
   GET ALL DRAFT PACKING LIST
====================================================== */
exports.getDraftPackingList = async (req, res) => {
  try {
    const data = await DraftPackingListModel.findAll({
      order: [["id", "DESC"]]
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Fetch Error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

/* ======================================================
   DELETE DRAFT PACKING LIST
====================================================== */
exports.deleteDraftPackingList = async (req, res) => {
  try {
    const { id } = req.params;

    const draftPackingList = await DraftPackingListModel.findByPk(id);

    if (!draftPackingList) {
      return res.status(404).json({
        message: "Draft Packing List not found"
      });
    }

    // delete file
    if (draftPackingList.file && fs.existsSync(draftPackingList.file)) {
      fs.unlinkSync(draftPackingList.file);
    }

    await draftPackingList.destroy();

    return res.status(200).json({
      message: "Draft Packing List deleted successfully",
      id
    });
  } catch (error) {
    console.error("Delete Error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

exports.download = async (req, res, next) => {
  try {
    const id = req.params.id;

    const invoice = await DraftPackingListModel.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    // middleware ko data pass
    req.fileData = invoice;
    return next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Download failed" });
  }
};
