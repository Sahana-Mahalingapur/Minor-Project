const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to DB');

        const email = 'mahalingapursahana@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        user.password = 'password123';
        await user.save(); // Will trigger pre-save hash

        console.log(`✅ Password for ${email} reset to 'password123'`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error resetting password:', err);
        process.exit(1);
    }
};

resetPassword();
