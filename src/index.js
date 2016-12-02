import request from 'superagent';
import defaultMiddleware from './middlewares/defaultMiddleware';
import defaultHandler from './handlers/defaultHandler';
import dbg from 'debug';

const debug = dbg('ovh-cti:main');

export class OvhCti {
  constructor(token) {
    this.token = token;
    this.middlewares = [defaultMiddleware];
    this.handlers = [defaultHandler];
  }

  addHandler(handler) {
    this.handlers.unshift(handler);
  }

  addMiddleware(middleware) {
    this.middlewares.unshift(middleware);
  }

  removeAllHandlers() {
    this.handlers = [];
  }

  removeAllMiddlewares() {
    this.middlewares = [];
  }

  run() {
    request.get('https://events.voip.ovh.net').query({token: this.token}).then(res => JSON.parse(res.text))
    .then(event => this._processEvent(event), err => {
      throw new Error(err);
    }).then(processedEvent => this._handleEvent(processedEvent), err => {
      throw new Error(err);
    }).then(() => this.run(), err => {
      throw new Error(err);
    });
  }

  _processEvent(event) {
    return Promise.resolve(event); //TODO: Run middlewares on event
  }

  _handleEvent(event) {
    return Promise.all(this.handlers.map(handler => new Promise((resolve, reject) => handler(event, resolve, reject))));
  }
}

export default OvhCti;
