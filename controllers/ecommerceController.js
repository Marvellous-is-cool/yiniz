// controllers/ecommerceController.js
const pool = require("../models/connection");

const getAllEcommerceSellers = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM yiniz_sellers");
    return rows;
  } catch (error) {
    throw error;
  }
};

const getAllEcommerceProducts = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM yiniz_products");
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllEcommerceSellers,
  getAllEcommerceProducts,
};
