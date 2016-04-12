// https://github.com/capriza/node-busmq#browser-support

import busmq from 'busmq';

import { log } from './log.js';

log('bus starting...');

export const bus = busmq(`ws://${location.host}/bus/federated`, 'mysecret');

bus.on('online', () => log('bus online'));
bus.on('offline', () => log('bus offline'));
bus.on('error', (err) => log(`bus error: ${err}`));

const SUBJECT = 'heartbeat';

export let pubsub;

bus.pubsub(SUBJECT, (err, ps) => {
  if (err) {
    log(`pubsub [${SUBJECT}]: err = ${err}`);
    return;
  }

  pubsub = ps;

  [
    'subscribed', 'unsubscribed'
  ].forEach((event) => {
    pubsub.on(event, () => log(`pubsub [${SUBJECT}]: event = ${event}`));
  });

  pubsub.on('message', (msg) => log(`pubsub [${SUBJECT}]: msg = ${msg}`));
  pubsub.on('error', (err) => log(`pubsub [${SUBJECT}]: err = ${err}`));

  pubsub.subscribe();

  setInterval(() => {
    pubsub.publish('ping');
  }, 15e3);
});
