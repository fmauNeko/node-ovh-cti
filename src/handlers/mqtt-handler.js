import dbg from 'debug';
import mqtt from 'mqtt';

const debug = dbg('ovh-cti:handlers:mqtt');

export default function (conf) {
  if (conf.has('handlers.mqtt')) {
    var mqttConfig = conf.get('handlers.mqtt');
    var mqttClient = mqtt.connect(mqttConfig.broker, {rejectUnauthorized: false, username: mqttConfig.username, password: mqttConfig.password});
    return (event, resolve, reject) => {
      mqttClient.publish('ovh-cti/' + event.Ressource, event.Event, {}, err => {
        if (err) reject(err);
      });
      debug('Event ' + event.Event + ' published to topic ovh-cti/' + event.Ressource);
      resolve({mqtt: true});
    }
  } else {
    conf.set('handlers.mqtt', {broker: 'URI of your MQTT broker', username: 'admin', password: 'public'});
    console.log('MQTT handler needs configuration, see ' + conf.path + ' and restart the app.');
    return (event, resolve, reject) => {
      debug('MQTT handler disabled, configure it and restart');
      resolve({mqtt: false});
    }
  }
}
