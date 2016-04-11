// https://github.com/capriza/node-busmq#opening-a-bus-with-a-federation-server

'use strict';

const Bus = require('busmq');

// startBus (listener: http.Server)
function startBus (listener) {
  const options = {
    redis: 'redis://redis', // connect this bus to a local running redis
    federate: { // also open a federation server
      server: listener,
      secret: 'mysecret',   // a secret key for authorizing clients
      path: '/bus/federation' // the federation service at this path
    }
  };
  const bus = Bus.create(options);
  bus.on('online', () => {
    // the bus is now ready to receive federation requests
    console.log('BusMQ service listening...');
  });
  bus.connect();
}

module.exports = { startBus };
