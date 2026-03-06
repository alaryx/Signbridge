const multer = require('multer');
const path = require('path');

// Configure multer to use memory storage since we will stream direct to cloudinary,
// or disk storage for temp file then cloudinary. Disk storage is often safer for large videos.
const storage = multer.diskStorage({
    // Temporarily store in OS temp dir or local folder
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images and videos only
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only images and videos are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    }
});

module.exports = upload;
