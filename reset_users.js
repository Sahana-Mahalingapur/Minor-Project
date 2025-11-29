const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const resetUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to DB');

        console.log('🗑️  Clearing Users...');
        const result = await User.deleteMany({});

        console.log(`✅ Successfully deleted ${result.deletedCount} users.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error clearing users:', err);
        process.exit(1);
    }
};

resetUsers();
