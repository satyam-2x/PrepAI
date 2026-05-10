const multer = require("multer");

const upload = multer({
  // Store file temporarily in memory
  storage: multer.memoryStorage(),

  // Limit file size to 5MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  // Allow only PDF files
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

module.exports = upload;
