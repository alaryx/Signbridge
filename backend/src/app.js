const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes will be imported and used here
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/translate', require('./routes/translate.routes'));
app.use('/api/learning', require('./routes/learning.routes'));
app.use('/api/session', require('./routes/session.routes'));

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
});

module.exports = app;
