const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const resetDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to DB');

        console.log('🗑️  Clearing Users...');
        await User.deleteMany({});

        console.log('🗑️  Clearing Products...');
        await Product.deleteMany({});

        console.log('🗑️  Clearing Orders...');
        await Order.deleteMany({});

        console.log('✅ Database successfully cleared.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error clearing DB:', err);
        process.exit(1);
    }
};

resetDb();
