const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

exports.protectedExcelDownload = async (req, res, next) => {
  try {
    const file = req.fileData; // controller se ayega

    if (!file || !file.file) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    const filePath = path.join(__dirname, "../../../", file.file);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File missing on server"
      });
    }

    /* ================= READ EXCEL ================= */
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    /* ================= PROTECT ALL SHEETS ================= */
    workbook.worksheets.forEach(async (sheet) => {
      await sheet.protect("1234", {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: false,
        insertColumns: false,
        insertRows: false,
        deleteColumns: false,
        deleteRows: false
      });
    });

    /* ================= DOWNLOAD ================= */
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${path.basename(file.file)}`
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.log("Download Middleware Error:", error);

    res.status(500).json({
      message: "Download failed"
    });
  }
};
