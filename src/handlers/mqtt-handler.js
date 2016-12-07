import dbg from 'debug';
import mqtt from 'mqtt';

const debug = dbg('ovh-cti:handlers:mqtt');

export default function (conf) {
  if (conf.has('handlers.mqtt')) {
    const mqttConfig = conf.get('handlers.mqtt');
    const mqttClient = mqtt.connect(mqttConfig.broker, {
      rejectUnauthorized: false,
      username: mqttConfig.username,
      password: mqttConfig.password
    });
    return (event, resolve, reject) => {
      mqttClient.publish('voip/' + event.Ressource, event.Status, {}, err => {
        if (err) {
          reject(err);
        }
      });
      debug('Event ' + event.Status + ' published to topic voip/' + event.Ressource);
      resolve({mqtt: true});
    };
  }

  conf.set('handlers.mqtt', {
    broker: 'mqtts://broker.example.com',
    username: 'my_user',
    password: '$ekret_p4$$w0rD'
  });
  console.log('MQTT handler needs configuration, see ' + conf.path + ' and restart the app.');
  return (event, resolve) => {
    debug('MQTT handler disabled, configure it and restart');
    resolve({mqtt: false});
  };
}
