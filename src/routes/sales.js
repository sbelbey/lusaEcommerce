const { Router } = require("express");
const router = Router();

const {
  allSales,
  storageSale,
  getSale,
  updateSale,
  eraseSale
} = require("../controllers/salesController");

// Get all sales
router.get("/", allSales);

// Create a Sale
router.post("/create", storageSale);

//Update a Sale
router.put("/update/:id", updateSale)

// Delete a Sale
router.delete("/delete/:id", eraseSale)

// Get a Sale by id
router.get("/:id", getSale);

module.exports = router;
