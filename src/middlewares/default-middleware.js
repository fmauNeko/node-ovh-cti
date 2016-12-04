import dbg from 'debug';

const debug = dbg('ovh-cti:middlewares:default');

export default function (event) {
  debug('Event processed');
  return Promise.resolve([...event.Events]);
}
