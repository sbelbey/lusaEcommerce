const {Router} = require('express');
const router = Router();

const {allProducts, createProduct, productStorage} = require('../controllers/productsController');

// Show all products
router.get('/', allProducts);

// CREATE PRODUCT
router.get('/create', createProduct);
// PROCESS CREATE PRODUCT
router.post('/create', productStorage);

// Read a Product

module.exports = router;