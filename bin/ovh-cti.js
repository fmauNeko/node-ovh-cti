const Configstore = require('configstore');
const OvhCti = require('../lib/index.js').OvhCti;
const mqttHandler = require('../lib/handlers/mqttHandler').default;
const pkg = require('../package.json');

const conf = new Configstore(pkg.name, {token: 'CONFIGUREME', handlers: {}, middlewares: {}});

const token = conf.get('token');

if (/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(token)) {
  const cti = new OvhCti(token);
  cti.addHandler(mqttHandler(conf));
  cti.run();
} else {
  console.log('Your token is wrong or not configured, it should be an UUID. Please fix it at ' + conf.path);
  process.exitCode = 1;
}
