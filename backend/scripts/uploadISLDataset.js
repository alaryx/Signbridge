require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('../src/config/cloudinary');
const Sign = require('../src/models/Sign');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const DATASET_PATH = path.join(__dirname, '../../frontend/public/ISL_Dataset');

const uploadToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'video',
            folder: `signbridge/${folder}`,
        });
        return result;
    } catch (error) {
        console.error(`Cloudinary Upload Error for ${filePath}:`, error);
        throw error;
    }
};

const processCategory = async (categoryFolder, type) => {
    const categoryPath = path.join(DATASET_PATH, categoryFolder);

    if (!fs.existsSync(categoryPath)) {
        console.log(`Directory not found: ${categoryPath}`);
        return;
    }

    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
        if (!file.endsWith('.mp4')) continue;

        const filePath = path.join(categoryPath, file);
        const fileNameWithoutExt = path.parse(file).name;
        const word = fileNameWithoutExt.toUpperCase();

        console.log(`\nUploading: ${word}`);

        try {
            const existingSign = await Sign.findOne({ word });
            if (existingSign) {
                console.log(`Skipping: ${word} already exists in MongoDB.`);
                continue;
            }

            const uploadResult = await uploadToCloudinary(filePath, categoryFolder);
            console.log(`Uploaded to Cloudinary`);

            const newSign = new Sign({
                word: word,
                type: type,
                category: categoryFolder,
                videoUrl: uploadResult.secure_url,
                cloudinaryId: uploadResult.public_id
            });

            await newSign.save();
            console.log(`Saved to MongoDB`);

        } catch (error) {
            console.error(`Error processing ${word}:`, error);
        }
    }
};

const run = async () => {
    await connectDB();

    console.log('Starting ISL Dataset Upload...');

    await processCategory('Words', 'word');
    await processCategory('Alphabets', 'letter');
    await processCategory('Numbers', 'number');

    console.log('\nUpload process completed!');
    process.exit(0);
};

run();
