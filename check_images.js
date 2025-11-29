const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to DB');

        const products = await Product.find({});
        console.log('--- PRODUCTS & IMAGES ---');
        products.forEach(p => {
            console.log(`Name: ${p.name}, Image Path: '${p.image}'`);
        });
        console.log('-------------------------');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkImages();
