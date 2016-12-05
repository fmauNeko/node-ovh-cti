import dbg from 'debug';

const debug = dbg('ovh-cti:middlewares:drop-registered-events');

export default function (event) {
  return new Promise(resolve => {
    const filteredEvents = event.Events.filter(event => event.Event !== 'registered');
    const count = event.Events.length - filteredEvents.length
    if (count > 0) {
      debug('Filtered ' + count + ' SIP \'registered\' events.');
      event.Events = filteredEvents;
    } else {
      debug('No SIP \'registered\' events found.');
    }
    resolve(event);
  });
}
