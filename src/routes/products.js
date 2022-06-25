const {Router} = require('express');
const router = Router();

const {allProducts, storageProduct, getProduct, eraseProduct, updateProduct} = require('../controllers/productsController');

// Show and find all products
router.get('/', allProducts);

// CREATE PRODUCT
router.post('/create', storageProduct);

//Delete product
router.delete('/delete/:id', eraseProduct)

//Update product
router.put('/update/:id', updateProduct);

// Read a Product
router.get('/:id', getProduct);


module.exports = router;