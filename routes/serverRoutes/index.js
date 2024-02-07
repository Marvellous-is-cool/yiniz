// routes/serverRoutes/index.js
const express = require("express");
const router = express.Router();
const businessRouter = require("./business/login");
const blogRouter = require("./blog");

// Use the business router for /ecommerce
router.use("/ecommerce/seller", businessRouter);

// Use the blog router for /admin/blog
router.use("/blog/blogger", blogRouter);

module.exports = router;
