const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
    // --- FRUITS (30) ---
    { name: 'Apples', category: 'Fruits', price: 120, image: '/images/Apples.jpg', description: 'Sweet and crunchy apples.', freshness: 9 },
    { name: 'Bananas', category: 'Fruits', price: 40, image: '/images/Bananas.jpg', description: 'High energy bananas.', freshness: 8 },
    { name: 'Grapes', category: 'Fruits', price: 90, image: '/images/Grapes.jpg', description: 'Seedless green grapes.', freshness: 8 },
    { name: 'Mangoes', category: 'Fruits', price: 150, image: '/images/Mangoes.jpg', description: 'King of fruits.', freshness: 10 },
    { name: 'Oranges', category: 'Fruits', price: 80, image: '/images/Oranges.jpg', description: 'Citrusy and full of Vitamin C.', freshness: 9 },
    { name: 'Strawberries', category: 'Fruits', price: 200, image: '/images/Strawberries.jpg', description: 'Fresh red strawberries.', freshness: 8 },
    { name: 'Watermelon', category: 'Fruits', price: 80, image: '/images/Watermelon.png', description: 'Juicy and sweet watermelon.', freshness: 9 },
    { name: 'Pineapple', category: 'Fruits', price: 100, image: '/images/Pineapple.png', description: 'Tropical fresh pineapple.', freshness: 8 },
    { name: 'Pomegranate', category: 'Fruits', price: 180, image: '/images/Pomegranate.jpg', description: 'Rich in antioxidants.', freshness: 9 },
    { name: 'Papaya', category: 'Fruits', price: 60, image: '/images/Papaya.jpg', description: 'Sweet and ripe papaya.', freshness: 8 },
    { name: 'Kiwi', category: 'Fruits', price: 150, image: '/images/Kiwi.jpeg', description: 'Tangy and green.', freshness: 9 },
    { name: 'Dragon Fruit', category: 'Fruits', price: 200, image: '/images/Dragon Fruit.jpg', description: 'Exotic cactus fruit.', freshness: 8 },
    { name: 'Guava', category: 'Fruits', price: 50, image: '/images/Guava.jpg', description: 'Tropical delight.', freshness: 7 },
    { name: 'Peach', category: 'Fruits', price: 180, image: '/images/Peach.jpg', description: 'Soft and juicy.', freshness: 8 },
    { name: 'Pear', category: 'Fruits', price: 160, image: '/images/Pear.jpg', description: 'Sweet and gritty.', freshness: 9 },
    { name: 'Plum', category: 'Fruits', price: 140, image: '/images/Plum.jpg', description: 'Sweet and sour.', freshness: 8 },
    { name: 'Apricot', category: 'Fruits', price: 220, image: '/images/Apricot.jpg', description: 'Golden orange fruit.', freshness: 9 },
    { name: 'Cherry', category: 'Fruits', price: 300, image: '/images/Cherry.jpg', description: 'Red and sweet.', freshness: 10 },
    { name: 'Avocado', category: 'Fruits', price: 400, image: '/images/Avocado.jpeg', description: 'Creamy superfood.', freshness: 9 },
    { name: 'Blackberry', category: 'Fruits', price: 350, image: '/images/Blackberry.jpg', description: 'Dark and juicy.', freshness: 8 },
    { name: 'Blueberry', category: 'Fruits', price: 450, image: '/images/Blueberry.jpg', description: 'Antioxidant rich.', freshness: 9 },
    { name: 'Raspberry', category: 'Fruits', price: 400, image: '/images/Raspberry.jpg', description: 'Delicate and sweet.', freshness: 8 },
    { name: 'Date', category: 'Fruits', price: 300, image: '/images/Date.jpg', description: 'Sweet energy booster.', freshness: 10 },
    { name: 'Passion Fruit', category: 'Fruits', price: 250, image: '/images/Passionfruit.jpg', description: 'Tropical flavor.', freshness: 8 },
    { name: 'Jackfruit', category: 'Fruits', price: 100, image: '/images/Jackfruit.jpg', description: 'Large and sweet.', freshness: 7 },
    { name: 'Melon', category: 'Fruits', price: 70, image: '/images/Melon.jpg', description: 'Sweet muskmelon.', freshness: 9 },

    // --- VEGETABLES (30) ---
    { name: 'Carrots', category: 'Vegetables', price: 60, image: '/images/Carrots.jpg', description: 'Organic carrots.', freshness: 9 },
    { name: 'Cucumbers', category: 'Vegetables', price: 30, image: '/images/Cucumbers.jpg', description: 'Cool cucumbers.', freshness: 7 },
    { name: 'Onions', category: 'Vegetables', price: 35, image: '/images/Onions.jpg', description: 'Kitchen essential.', freshness: 6 },
    { name: 'Potatoes', category: 'Vegetables', price: 25, image: '/images/Potatoes.jpg', description: 'Versatile tubers.', freshness: 7 },
    { name: 'Tomatoes', category: 'Vegetables', price: 40, image: '/images/Tomatoes.jpg', description: 'Red and ripe.', freshness: 9 },
    { name: 'Spinach', category: 'Vegetables', price: 40, image: '/images/Spinach.png', description: 'Iron rich greens.', freshness: 10 },
    { name: 'Cauliflower', category: 'Vegetables', price: 50, image: '/images/Cauliflower.png', description: 'Fresh white head.', freshness: 9 },
    { name: 'Broccoli', category: 'Vegetables', price: 120, image: '/images/Broccoli.jpg', description: 'Green superfood.', freshness: 9 },
    { name: 'Beetroot', category: 'Vegetables', price: 40, image: '/images/Beetroot.jpg', description: 'Red root vegetable.', freshness: 8 },
    { name: 'Pumpkin', category: 'Vegetables', price: 30, image: '/images/Pumpkin.jpg', description: 'Orange pumpkin.', freshness: 9 },
    { name: 'Bitter Gourd', category: 'Vegetables', price: 35, image: '/images/Bitter Gourd.jpg', description: 'Karela.', freshness: 9 },
    { name: 'Corn', category: 'Vegetables', price: 20, image: '/images/Corn.jpg', description: 'Sweet corn.', freshness: 9 },
    { name: 'Sweet Potato', category: 'Vegetables', price: 40, image: '/images/Sweet Patato.jpg', description: 'Shakarkandi.', freshness: 8 },
    { name: 'Ginger', category: 'Vegetables', price: 100, image: '/images/Ginger.jpg', description: 'Spice root.', freshness: 7 },
    { name: 'Garlic', category: 'Vegetables', price: 120, image: '/images/Garlic.jpg', description: 'Flavorful bulbs.', freshness: 8 },
    { name: 'Chili', category: 'Vegetables', price: 60, image: '/images/Chili.jpg', description: 'Green chilies.', freshness: 9 },
    { name: 'Coriander', category: 'Vegetables', price: 20, image: '/images/Coriander.jpg', description: 'Fresh dhaniya.', freshness: 10 },
    { name: 'Mint', category: 'Vegetables', price: 20, image: '/images/Mint.jpg', description: 'Fresh pudina.', freshness: 10 },

    // --- OTHER (30) ---
    { name: 'Fresh Milk', category: 'Other', price: 60, image: '/images/Milk.png', description: 'Pure cow milk.', freshness: 10 },
    { name: 'Organic Honey', category: 'Other', price: 350, image: '/images/Honey.png', description: 'Raw honey.', freshness: 10 },
    { name: 'Farm Eggs', category: 'Other', price: 10, image: '/images/Eggs.png', description: 'Brown eggs.', freshness: 9 },
    { name: 'Cheese', category: 'Other', price: 250, image: '/images/Cheese.jpeg', description: 'Cheddar cheese.', freshness: 8 },
    { name: 'Butter', category: 'Other', price: 280, image: '/images/Butter.jpg', description: 'Farm butter.', freshness: 9 },
    { name: 'Pickle', category: 'Other', price: 120, image: '/images/Pickel.jpg', description: 'Mango pickle.', freshness: 8 },
    { name: 'Jam', category: 'Other', price: 150, image: '/images/Jam.jpg', description: 'Fruit jam.', freshness: 8 },
    { name: 'Sauce', category: 'Other', price: 100, image: '/images/Sauce.jpg', description: 'Tomato ketchup.', freshness: 8 }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to DB');

        // Find a farmer to assign these products to
        let farmer = await User.findOne({ role: 'farmer' });

        if (!farmer) {
            console.log('⚠️ No farmer found. Creating one...');
            farmer = await User.create({
                name: 'Default Farmer',
                email: 'farmer@example.com',
                password: 'password123',
                role: 'farmer'
            });
        }

        console.log(`👨‍🌾 Assigning products to farmer: ${farmer.name}`);

        // Clear existing products
        await Product.deleteMany({});

        for (const p of products) {
            await Product.create({
                ...p,
                farmer: farmer._id,
                stock: 100
                // freshness is now in the object
            });
        }

        console.log('✅ Successfully seeded products with images.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding products:', err);
        process.exit(1);
    }
};

seedProducts();
