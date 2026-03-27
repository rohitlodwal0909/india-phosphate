const db = require("../../../models");
const { ExportPackingListModel } = db;

exports.exportPackingListUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const filePath = req.file.path;

    await ExportPackingListModel.create({
      user_id: req.admin.id,
      name: req.body.name,
      file: filePath
    });

    res.json({
      message: "File uploaded successfully",
      file: filePath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

exports.exportPackingListUpdate = async (req, res) => {
  try {
    const id = req.params.id;

    /* ================= Find Existing Record ================= */
    const invoice = await ExportPackingListModel.findByPk(id);

    if (!invoice) {
      return res.status(404).json({
        message: "PackingList not found"
      });
    }

    let filePath = invoice.file;

    /* ================= If New File Uploaded ================= */
    if (req.file) {
      // delete old file (optional but best practice)
      if (invoice.file && fs.existsSync(invoice.file)) {
        fs.unlinkSync(invoice.file);
      }

      filePath = req.file.path;
    }

    /* ================= Update Record ================= */
    await invoice.update({
      name: req.body.name,
      file: filePath,
      user_id: req.admin.id
    });

    return res.status(200).json({
      message: "PackingList updated successfully",
      data: invoice
    });
  } catch (error) {
    console.error("Update Error:", error);

    return res.status(500).json({
      message: "Update failed"
    });
  }
};

exports.getExcelPackingList = async (req, res) => {
  try {
    const data = await ExportPackingListModel.findAll({
      order: [["id", "DESC"]]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExportPackingList = async (req, res) => {
  try {
    await ExportPackingListModel.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: "Export invoice Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.download = async (req, res, next) => {
  try {
    const id = req.params.id;

    const invoice = await ExportPackingListModel.findByPk(id);

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
