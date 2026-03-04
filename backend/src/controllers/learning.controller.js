exports.getLessons = (req, res) => {
    const lessons = [
        { id: 1, title: 'Basics of ISL', difficulty: 'Beginner', xp: 50 },
        { id: 2, title: 'Common Greetings', difficulty: 'Beginner', xp: 100 },
        { id: 3, title: 'Numbers & Colors', difficulty: 'Intermediate', xp: 150 },
        { id: 4, title: 'Everyday Phrases', difficulty: 'Intermediate', xp: 200 }
    ];
    res.status(200).json({ status: 'success', data: lessons });
};

exports.getLessonById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        status: 'success',
        data: { id, title: `Lesson ${id}`, content: `Mock content for lesson ${id}` }
    });
};
