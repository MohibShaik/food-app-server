const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/utilities/db/mongoose-client');
const router = express.Router();
const applyRoutes = require('./src/routes/index-route');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Make io accessible to the routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));

app.get('/api/health-check', (req, res) => {
  res.send('Server is up and running');
});

app.use('/api', applyRoutes.routes(router));

app.use(function (err, req, res, next) {
  console.log(err);
  // console.log(err);
  if (err.response) {
    return res
      .status(err.response?.status)
      .send(err.response?.data);
  }
  return res
    .status(500)
    .send(
      'Internal Server Error. Please contact Administrator'
    );
});

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('Admin connected');
});

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Food application.' });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
