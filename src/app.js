const express = require('express');
const cors = require('cors');
const path = require('path');
const { ROOT_DIR } = require('./config');
const apiRouter = require('./routes/api');
const webRouter = require('./routes/web');

const app = express();

// Set global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.join(ROOT_DIR, 'public')));

// Mount routers
app.use('/api/transfers', apiRouter);
app.use('/', webRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Une erreur interne inattendue est survenue.' });
});

module.exports = app;
