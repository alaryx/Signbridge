exports.startSession = (req, res) => {
    const sessionId = `session_${Date.now()}`;
    res.status(200).json({
        status: 'success',
        message: 'Session started successfully',
        sessionId
    });
};

exports.endSession = (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) {
        return res.status(400).json({ status: 'error', message: 'Session ID required' });
    }
    res.status(200).json({
        status: 'success',
        message: `Session ${sessionId} ended successfully`
    });
};
