const express = require("express");
const router = express.Router();
const ecommerceController = require("../../../controllers/ecommerceController");

router.get("/", (req, res) => {
  res.render("business/index");
});

router.get("/products", async (req, res) => {
  try {
    // Fetch products from the database using the ecommerceController
    const products = await ecommerceController.getAllEcommerceProducts();

    // Render the products.ejs file and pass the products data
    res.render("business/products", { products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
