const mongoose = require('mongoose');
require('dotenv').config();

// Define minimal schemas for the script
const lessonSchema = new mongoose.Schema({ courseId: mongoose.Schema.Types.ObjectId });
const courseSchema = new mongoose.Schema({});
const Lesson = mongoose.model('Lesson', lessonSchema);
const Course = mongoose.model('Course', courseSchema);

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://iamalaryx_db_user:rTfnrOef4eZ4pA2I@akshadatabase.fekthn2.mongodb.net/test?retryWrites=true&w=majority');
        console.log('Connected to MongoDB');

        const allLessons = await Lesson.find({});
        console.log(`Checking ${allLessons.length} lessons...`);

        let deletedCount = 0;
        for (const lesson of allLessons) {
            const courseExists = await Course.exists({ _id: lesson.courseId });
            if (!courseExists) {
                console.log(`Lesson ${lesson._id} is orphaned (Course ${lesson.courseId} not found). Deleting...`);
                await Lesson.findByIdAndDelete(lesson._id);
                deletedCount++;
            }
        }

        console.log(`Cleanup complete. Deleted ${deletedCount} orphaned lessons.`);
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanup();
