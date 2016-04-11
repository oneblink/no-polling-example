// http://hapijs.com/tutorials/getting-started

'use strict';

const path = require('path');

const Hapi = require('hapi');

// startHapi (listener: http.Server, port: Number)
function startHapi (listener, port) {
  const server = new Hapi.Server();
  server.connection({
    autoListen: false,
    listener
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
    console.log('Hapi.js service listening...');
  });
}

module.exports = { startHapi };
