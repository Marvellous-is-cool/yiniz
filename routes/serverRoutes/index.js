const express = require("express");
const router = express.Router();
const businessRouter = require("./business/login");
const blogRouter = require("./blog");
const assignmentRouter = require("./submitAss");

router.use("/ecommerce/seller", businessRouter);
router.use("/blog/blogger", blogRouter);
router.use("/yap", assignmentRouter);

module.exports = router;
