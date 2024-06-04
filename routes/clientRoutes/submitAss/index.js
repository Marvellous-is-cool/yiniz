const express = require("express");
const authRoutes = require("./auth");
const uploadRoutes = require("./upload");

const router = express.Router();

router.use(authRoutes); // Handles /login and /register
router.use(uploadRoutes); // Handles /submit

module.exports = router;
