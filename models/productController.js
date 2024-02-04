// models/productController.js
const pool = require("../model/connection");

const getYinizProductById = async (productId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM yiniz_products WHERE product_id = ?",
      [productId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getYinizProductById,
};
