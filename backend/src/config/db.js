const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdminUser = async () => {
    try {
        const adminEmail = 'admin@signbridge.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'signbridgeadmin@123',
                role: 'admin',
            });
            console.log('✅ Default Admin User seeded successfully!');
        } else {
            console.log('⚡ Admin User already exists, skipping seed.');
        }
    } catch (error) {
        console.error(`Error seeding admin user: ${error.message}`);
    }
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedAdminUser();
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
