const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');
        const count = await Product.countDocuments();
        console.log(`Total Products: ${count}`);

        const products = await Product.find({});
        console.log('--- PRODUCTS IN DB ---');
        products.forEach(p => {
            console.log(`Name: ${p.name}, Price: ${p.price}, Category: '${p.category}'`); // Quote category to see whitespace/case
        });
        console.log('----------------------');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
