// http://hapijs.com/tutorials/getting-started

'use strict';

const http = require('http');
const path = require('path');

const Hapi = require('hapi');

const listener = new http.Server();

const server = new Hapi.Server();
server.connection({
  listener,
  port: 3000
});

// http://hapijs.com/tutorials/serving-files#directory-handler
server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        index: true,
        path: path.join(__dirname, '..', 'dist')
      }
    }
  });
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

module.exports = { listener };
