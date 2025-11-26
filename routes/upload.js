const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// UPLOAD IMAGE (only farmers)
router.post("/", protect, authorize("farmer"), upload.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No image uploaded" });

  res.json({
    message: "Image uploaded successfully",
    imageUrl: "/uploads/" + req.file.filename,
  });
});

module.exports = router;
