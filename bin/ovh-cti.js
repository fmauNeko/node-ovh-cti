#!/usr/bin/env node
const Configstore = require('configstore');
const OvhCti = require('../lib/index.js');
const dropRegisteredEventsMiddleware = require('../lib/middlewares/drop-registered-events-middleware');
const lineStatusMiddleware = require('../lib/middlewares/line-status-middleware');
const mqttHandler = require('../lib/handlers/mqtt-handler');
const influxHandler = require('../lib/handlers/influx-handler');
const pkg = require('../package.json');

const conf = new Configstore(pkg.name, {token: 'CONFIGUREME', handlers: {}, middlewares: {}});

const token = conf.get('token');

if (/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(token)) {
  const cti = new OvhCti(token);
  cti.addMiddleware(dropRegisteredEventsMiddleware);
  cti.addMiddleware(lineStatusMiddleware);
  cti.addHandler(mqttHandler(conf));
  cti.addHandler(influxHandler(conf));
  cti.run();
} else {
  console.log('Your token is wrong or not configured, it should be an UUID. Please fix it at ' + conf.path);
  process.exitCode = 1;
}
