// https://github.com/capriza/node-busmq#browser-support

const Bus = require('busmq');

const log = (msg) => console.log(msg);

log('bus starting...');

const HOSTNAME = 'docker.local';
const HOST = `${HOSTNAME}:3000`;

const bus = Bus.create({
  // redis: [`redis://${HOSTNAME}:6379`]
  federate: {
    poolSize: 5,
    urls: [`http://${HOST}/bus/federated`],
    secret: 'mysecret'
  }
});

// only triggered regarding direct Redis connection
bus.on('online', () => log('bus online'));
bus.on('offline', () => log('bus offline'));
bus.on('error', (err) => log(`bus error: ${err}`));

const SUBJECT = 'heartbeat';
const startPubSub = (pubsub) => {
  [
    'reconnecting', 'reconnected', 'subscribed', 'unsubscribed'
  ].forEach((event) => {
    pubsub.on(event, () => log(`pubsub [${SUBJECT}]: event = ${event}`));
  });
  pubsub.on('message', (msg) => log(`pubsub [${SUBJECT}]: msg = ${msg}`));
  pubsub.on('error', (err) => log(`pubsub [${SUBJECT}]: err = ${err}`));

  pubsub.subscribe();

  setInterval(() => {
    pubsub.publish('ping');
  }, 15e3);
};

const startFedPubSub = (fed) => {
  [
    'unauthorized', 'close', 'ready'
  ].forEach((event) => {
    fed.on(event, () => log(`fed: event = ${event}`));
  });
  fed.on('error', (err) => log(`fed: err = ${err}`));

  fed.on('ready', (pubsub) => {
    startPubSub(pubsub);
  });
};

bus.on('online', () => {
  const fed = bus.federate(bus.pubsub(SUBJECT), `http://${HOST}/bus/federated`);
  startFedPubSub(fed);

  // const pubsub = bus.pubsub(SUBJECT);
  // startPubSub(pubsub);
});

bus.connect();
