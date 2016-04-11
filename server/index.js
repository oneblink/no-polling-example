'use strict';

const http = require('http');

const startBus = require('./bus.js').startBus;
const startHapi = require('./http.js').startHapi;

const server = new http.Server();

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`HTTP service started on port ${PORT}`);

  startHapi(server, PORT);
  startBus(server);
});

