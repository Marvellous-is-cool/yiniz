const express = require("express");
const router = express.Router();
const businessRouter = require("./business/login");

// Use the business router for /ecommerce
router.use("/ecommerce/seller", businessRouter);

// Use the blog router for /ecommerce
router.use("/blog/blogger", businessRouter);

module.exports = router;
