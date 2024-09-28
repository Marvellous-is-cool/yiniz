const express = require("express");
const router = express.Router();
const {
  uploadVideo,
  getVideo,
  logAction,
} = require("../../../../controllers/games/roftfsboreController");

const roftfsboreAdminRouter = require("./admin.js");

// admin route
router.use("/app/admin", roftfsboreAdminRouter);

// Middleware to validate app requests
const validateAppRequest = (req, res, next) => {
  const token = req.headers["x-app-token"];
  if (token === process.env.APP_SECRET) {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
};

// Video Upload
router.post("/app/upload", validateAppRequest, uploadVideo);

// Video Retrieval
router.get("/app/video/:id", validateAppRequest, getVideo);

// Log Action
router.post("/app/log", logAction);

module.exports = router;
