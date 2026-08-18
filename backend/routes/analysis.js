const express = require("express");
const multer = require("multer");

const {
  analyzeDocument,
} = require("../controllers/analysisController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",

  filename: (req, file, cb) => {
    const filename =
      Date.now() + "-" + file.originalname;

    cb(null, filename);
  },
});

const upload = multer({
  storage,
});


router.post(
  "/",
  upload.single("document"),
  analyzeDocument
);

module.exports = router;