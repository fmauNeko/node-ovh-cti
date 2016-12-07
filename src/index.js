import dbg from 'debug';
import request from 'superagent';
import defaultMiddleware from './middlewares/default-middleware';
import defaultHandler from './handlers/default-handler';

const debug = dbg('ovh-cti:main');

export default class OvhCti {
  constructor(token) {
    this.token = token;
    this.session = '';
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
    return request
      .get('https://events.voip.ovh.net')
      .query({...this._getSessionQuery(), token: this.token})
      .timeout(65000)
      .catch(err => {
        debug('Request failed: ' + err);
        return this.run();
      })
      .then(res => JSON.parse(res.text))
      .then(event => this._setSession(event), err => {
        throw new Error(err);
      })
      .then(event => this._processMiddlewares(event), err => {
        throw new Error(err);
      })
      .then(processedEvents => this._processHandlers(processedEvents), err => {
        throw new Error(err);
      })
      .then(() => this.run(), err => {
        throw new Error(err);
      });
  }

  _getSessionQuery() {
    return this.session === '' ? {} : {session: this.session};
  }

  _processHandlers(events) {
    debug('Processing handlers...');
    const handlers = [
      ...this.handlers,
      defaultHandler
    ];
    return Promise.all(events.map(event => handlers.map(handler => new Promise((resolve, reject) => handler(event, resolve, reject)))));
  }

  _processMiddlewares(event) {
    debug('Processing middlewares...');
    const middlewares = [
      ...this.middlewares,
      defaultMiddleware
    ];
    return middlewares.reduce((prev, cur) => prev.then(cur), Promise.resolve(event));
  }

  _setSession(event) {
    this.session = event.Session;
    return event;
  }
}
