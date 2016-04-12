// https://github.com/capriza/node-busmq#opening-a-bus-with-a-federation-server

'use strict';

const Bus = require('busmq');

const FED_PATH = '/bus/federated';

// startBus (listener: http.Server)
function startBus (listener) {
  const options = {
    redis: 'redis://redis', // connect this bus to a local running redis
    federate: { // also open a federation server
      server: listener,
      secret: 'mysecret',   // a secret key for authorizing clients
      path: FED_PATH // the federation service at this path
    }
  };
  const bus = Bus.create(options);
  bus.on('online', () => {
    // the bus is now ready to receive federation requests
    console.log('BusMQ service listening...');

    const SUBJECT = 'heartbeat';

    // pubsub
    const pubsub = bus.pubsub(SUBJECT);
    pubsub.on('message', (msg) => {
      console.log(`pubsub [${SUBJECT}]: msg = ${msg}`);
    });
    pubsub.subscribe();

    setInterval(() => {
      const msg = (new Date()).toISOString();
      pubsub.publish(msg);
    }, 15e3);
  });
  bus.connect();
}

module.exports = { startBus };
