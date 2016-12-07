import dbg from 'debug';

const debug = dbg('ovh-cti:middlewares:line-status');

const lineStatus = {};
const activeCalls = {};

export default function (event) {
  return new Promise(resolve => {
    event.Events.map(evt => {
      const startDate = new Date(evt.Data.Ts * 1000);
      startDate.setTime(startDate.getTime() - (startDate.getTimezoneOffset() * 60 * 1000));
      evt.Data.DateStart = startDate;

      switch (evt.Event) {
        case 'start_ringing':
          evt.Status = lineStatus[evt.Ressource] = 'ringing';
          activeCalls[evt.Data.CallId] = evt.Data;
          break;
        case 'start_calling':
          evt.Status = lineStatus[evt.Ressource] = 'calling';
          if (!(evt.Data.CallId in activeCalls)) {
            activeCalls[evt.Data.CallId] = evt.Data;
          }
          break;
        case 'end_ringing':
        case 'end_calling':
          evt.Status = lineStatus[evt.Ressource] = 'idle';
          if (evt.Data.CallId in activeCalls) {
            evt.CallDuration = (evt.Data.DateStart - activeCalls[evt.Data.CallId].DateStart) / 1000;
            delete activeCalls[evt.Data.CallId];
          }
          break;
        default:
          break;
      }

      return evt;
    });
    debug({Lines: lineStatus});
    debug({Calls: activeCalls});
    resolve(event);
  });
}
