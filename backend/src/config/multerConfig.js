const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");

const documentsDir = path.join(__dirname, "../../documents");

fs.ensureDirSync(documentsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    const { client, deadline } = req.task;
    const sanitizedClientName = client.name.replace(/\s+/g, "_");
    const sanitizedDeadline = new Date(deadline)
      .toLocaleTimeString()
      .replace(/\s+/g, "_")
      .replace(/:/g, "-");
    const fileExtension = path.extname(file.originalname);
    cb(null, `${sanitizedClientName}_${sanitizedDeadline}${fileExtension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only .doc, .docx, or .pdf files are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
