const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate('farmer', 'name email');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('farmer', 'name email');

        if (!product) {
            res.status(404);
            throw new Error(`Product not found with id of ${req.params.id}`);
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Farmer/Admin)
exports.createProduct = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.farmer = req.user.id;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Farmer/Admin)
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error(`Product not found with id of ${req.params.id}`);
        }

        // Make sure user is product owner or admin
        if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error(`User ${req.user.id} is not authorized to update this product`);
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Farmer/Admin)
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error(`Product not found with id of ${req.params.id}`);
        }

        // Make sure user is product owner or admin
        if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error(`User ${req.user.id} is not authorized to delete this product`);
        }

        await product.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
