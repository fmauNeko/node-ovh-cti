import defaultMiddleware from './middlewares/defaultMiddleware';
import defaultHandler from './handlers/defaultHandler';

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
    let event = {}; //TODO: Fetch event with superagent
    this._processEvent(event).then(processedEvent => this._handleEvent(processedEvent), err => {
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
