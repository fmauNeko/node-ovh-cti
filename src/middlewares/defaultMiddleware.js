import dbg from 'debug';

const debug = dbg('ovh-cti:middlewares:defaultMiddleware');

export default function (event, next) {
  return Promise.resolve(event);
}
