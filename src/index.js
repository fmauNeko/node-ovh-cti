import request from 'superagent';
import defaultMiddleware from './middlewares/defaultMiddleware';
import defaultHandler from './handlers/defaultHandler';
import dbg from 'debug';

const debug = dbg('ovh-cti:main');

export class OvhCti {
  constructor(token) {
    this.token = token;
    this.middlewares = [];
    this.handlers = [];
  }

  addHandler(handler) {
    this
      .handlers
      .push(handler);
  }

  addMiddleware(middleware) {
    this
      .middlewares
      .push(middleware);
  }

  removeAllHandlers() {
    this.handlers = [];
  }

  removeAllMiddlewares() {
    this.middlewares = [];
  }

  run() {
    request
      .get('https://events.voip.ovh.net')
      .query({token: this.token})
      .then(res => JSON.parse(res.text))
      .then(event => this._processMiddlewares(event), err => {
        throw new Error(err);
      })
      .then(processedEvents => this._processHandlers(processedEvents), err => {
        throw new Error(err);
      })
      .then(_ => this.run(), err => {
        throw new Error(err);
      });
  }

  _processHandlers(events) {
    let handlers = [
      ...this.handlers,
      defaultHandler,
    ];
    return Promise.all(events.map(event => handlers.map(handler => new Promise((resolve, reject) => handler(event, resolve, reject)))));
  }

  _processMiddlewares(event) {
    let middlewares = [
      ...this.middlewares,
      defaultMiddleware,
    ];
    return Promise.resolve([...event.Events]); //TODO: Run middlewares on event
  }
}

export default OvhCti;
