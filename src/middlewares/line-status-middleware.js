import dbg from 'debug';

const debug = dbg('ovh-cti:middlewares:line-status');
const lineStatus = {};

export default function (event) {
  return new Promise(resolve => {
    event.Events.map(evt => {
      lineStatus[evt.Ressource] = evt.Event;
    });
    debug('');
    resolve(event);
  });
}
