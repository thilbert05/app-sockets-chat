const express = require('express');
const path = require('path');
const colors = require('colors');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// IO = conexión directa del Backend
module.exports.io = socketIO(server);
require('./sockets/socket');

server.listen(port, (err) => {
  if (err) {
    throw new Error(err);
  }
  console.log(`El servidor está corriendo en el puerto ${colors.green(port)}`);
});