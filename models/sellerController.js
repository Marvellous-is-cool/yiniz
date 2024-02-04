// models/sellerController.js
const pool = require("../model/connection");

const getYinizSellerById = async (sellerId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM yiniz_sellers WHERE seller_id = ?",
      [sellerId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getYinizSellerById,
};
