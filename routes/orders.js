const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

const router = express.Router();

// PLACE ORDER
router.post("/", auth, async (req, res) => {
    const { productId, quantity, totalAmount } = req.body;

    try {
        const order = new Order({
            productId,
            quantity,
            totalAmount,
            user: req.user.id
        });

        await order.save();

        res.json({
            message: "Order placed successfully",
            order,
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err });
    }
});

module.exports = router;
