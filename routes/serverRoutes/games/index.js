const express = require("express");
const router = express.Router();
const roftfsboreRouter = require("./roftfsbore/index");

router.use("/roftfsbore", roftfsboreRouter);

module.exports = router;
