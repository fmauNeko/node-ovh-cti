import dbg from 'debug';
import mqtt from 'mqtt';

const debug = dbg('ovh-cti:handlers:mqtt');

export default function (broker, user, pw) {
  var mqttClient = mqtt.connect(broker, {rejectUnauthorized: false, username: user, password: pw});
  return (event, resolve, reject) => {
    mqttClient.publish('ovh-cti/' + event.Ressource, event.Event, {}, err => {
      if (err) reject(err);
    });
    debug('Event ' + event.Event + ' published to topic ovh-cti/' + event.Ressource);
    resolve(true);
  }
}
