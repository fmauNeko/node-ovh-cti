import dbg from 'debug';

const debug = dbg('ovh-cti:handlers:default');

export default function (event, resolve, reject) {
  debug(event);
  resolve(true);
}
