require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Course = require('./src/models/Course');
const Module = require('./src/models/Module');

const seedData = async () => {
    await connectDB();

    try {
        const course = await Course.create({
            title: 'Test Admin Course',
            description: 'Course created for testing admin uploads',
            order: 1
        });

        const moduleDoc = await Module.create({
            courseId: course._id,
            title: 'Test Upload Module',
            description: 'Module for testing',
            order: 1
        });

        console.log('Seeded successfully!');
        console.log(`Course ID: ${course._id}`);
        console.log(`Module ID (USE THIS IN UI): ${moduleDoc._id}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
