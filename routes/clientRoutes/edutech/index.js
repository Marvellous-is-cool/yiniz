const express = require("express");
const router = express.Router();
const etestRouter = require("./etest");

router.get("/", (req, res) => {
  res.render("edutech/index");
});

router.use("/", etestRouter);

module.exports = router;
