require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
// app.use('public', express.static(path.join(__dirname, )))
app.use('/public', express.static(path.join(__dirname, 'public')));

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Update this in production
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH'
  );
  next();
});

// Routes
const users = require('./routes/users');
const Tenders = require('./routes/tender');
const addAuction = require('./routes/addauction');
app.use('/api/v1/auth', users);
app.use('/api/v1/tenders', Tenders);
app.use('/api/v1/auction', addAuction);

app.get('/', (req, res) => {
  res.write('<h1>Welcome</h1>');
  res.write('<h2>Main Page</h2>');
  res.end();
});

app.use((error, req, res, next) => {
  return res.status(error.code || 401).json({ message: error.message });
});

app.all('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
