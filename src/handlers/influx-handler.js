import dbg from 'debug';
import {InfluxDB, FieldType} from 'influx';

const debug = dbg('ovh-cti:handlers:influx');

export default function (conf) {
  if (conf.has('handlers.influx')) {
    const influxConfig = conf.get('handlers.influx');
    const influxClient = new InfluxDB({
      ...influxConfig,
      schema: [
        {
          measurement: 'event',
          fields: {
            type: FieldType.STRING
          },
          tags: ['line']
        },
        {
          measurement: 'call',
          fields: {
            duration: FieldType.FLOAT
          },
          tags: ['external', 'internal']
        }
      ]
    });
    return (event, resolve, reject) => {
      if (event.Event === 'end_calling') {
        influxClient.writePoints([
          {
            measurement: 'call',
            fields: {
              duration: event.CallDuration
            },
            tags: {
              external: event.Data.Calling === event.Ressource ? event.Data.Called : event.Data.Calling,
              internal: event.Data.Calling === event.Ressource ? event.Data.Calling : event.Data.Called
            }
          }
        ]).catch(err => {
          reject(err);
        });
        debug('Call ' + event.Data.CallId + ' added to database ' + influxConfig.database);
      }
      influxClient.writePoints([
        {
          measurement: 'event',
          fields: {
            type: event.Event
          },
          tags: {
            line: event.Ressource
          }
        }
      ]).catch(err => {
        reject(err);
      });
      debug('Event ' + event.Event + ' added to database ' + influxConfig.database);
      resolve({influx: true});
    };
  }

  conf.set('handlers.influx', {
    database: 'voip',
    protocol: 'https',
    host: 'influxdb.example.com',
    port: 8086,
    username: 'my_user',
    password: '$ekret_p4$$w0rD'
  });
  console.log('InfluxDB handler needs configuration, see ' + conf.path + ' and restart the app.');
  return (event, resolve) => {
    debug('InfluxDB handler disabled, configure it and restart');
    resolve({influx: false});
  };
}
