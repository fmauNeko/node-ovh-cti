import dbg from 'debug';
import {Influx} from 'influx';

const debug = dbg('ovh-cti:handlers:influx');

export default function (host, database, user, pw) {
  const influxClient = new Influx.InfluxDB({

  });
  return (event, resolve, reject) => {
    resolve(true);
  }
}
