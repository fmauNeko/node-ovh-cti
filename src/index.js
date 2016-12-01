import defaultHandler from './handlers/defaultHandler';

export class OvhCti {
  constructor(token) {
    this.token = token;
    this.handlers = [defaultHandler];
  }

  async _processEvent(event) {
    let handlersPromises = this.handlers.map(handler => handler());
    await Promise.all(handlersPromises);
  }
}
