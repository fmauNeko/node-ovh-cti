const OvhCti = require('../lib/index.js').OvhCti;
const mqttHandler = require('../lib/handlers/mqttHandler').default;

var cti = new OvhCti(process.argv[2]);
cti.addHandler(mqttHandler('mqtts://broker.dissidence.ovh', process.argv[3], process.argv[4]));
cti.run();
