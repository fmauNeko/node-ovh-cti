import dbg from 'debug';

const debug = dbg('ovh-cti:handlers:defaultHandler');

export default function (event, resolve, reject) {
  resolve(event);
}
