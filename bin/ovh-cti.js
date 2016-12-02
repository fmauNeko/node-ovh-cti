const OvhCti = require('../lib/index.js').OvhCti;

var cti = new OvhCti(process.argv[2]);
cti.run();
