const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getProducts)
    .post(protect, authorize('farmer', 'admin'), createProduct);

router
    .route('/:id')
    .get(getProduct)
    .put(protect, authorize('farmer', 'admin'), updateProduct)
    .delete(protect, authorize('farmer', 'admin'), deleteProduct);

module.exports = router;
