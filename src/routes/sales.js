const { Router } = require("express");
const router = Router();

const { allSales } = require("../controllers/salesController");

// Get all products
router.get("/", allSales);

module.exports = router;
