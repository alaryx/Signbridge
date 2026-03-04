exports.translate = (req, res) => {
    const { direction, content } = req.body;

    if (!direction || !content) {
        return res.status(400).json({ status: 'error', message: 'Direction and content required' });
    }

    let output = '';

    if (direction === 'sign_to_text') {
        output = `Mock translated text for sign gestures: [${content}]`;
    } else if (direction === 'text_to_sign') {
        output = `mock_sign_gif_url_for_text: [${content}]`;
    } else {
        return res.status(400).json({ status: 'error', message: 'Invalid direction' });
    }

    res.status(200).json({
        status: 'success',
        direction,
        output,
        confidence: 0.95
    });
};
