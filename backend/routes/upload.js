const express = require("express");
const multer = require("multer");

const {
  analyzeDocument,
} = require("../controllers/analysisController");

const router = express.Router();

// =====================================
// MULTER STORAGE
// =====================================

const storage = multer.diskStorage({
  destination: "uploads/",

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
});

// =====================================
// UPLOAD + ANALYZE DOCUMENT
// =====================================

router.post(
  "/",
  upload.single("document"),
  analyzeDocument
);

module.exports = router;