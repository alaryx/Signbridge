const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email and password required' });
    }

    // ✅ Validate email format
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ status: 'error', message: 'Please provide a valid email address.' });
    }

    const token = 'mock_jwt_token_12345';
    res.status(200).json({
        status: 'success',
        token,
        user: { id: 1, name: 'Test User', email }
    });
};

exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ status: 'error', message: 'Name, email and password are required.' });
    }

    // ✅ Validate email format
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ status: 'error', message: 'Please provide a valid email address.' });
    }

    const token = 'mock_jwt_token_12345';
    res.status(201).json({
        status: 'success',
        token,
        user: { id: 2, name, email }
    });
};