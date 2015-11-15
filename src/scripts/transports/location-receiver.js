import { locationReceiverUrl } from '../config';

const parse = JSON.parse;

export class LocationReceiver {
  constructor(callback) {
    this.ws = null;
    this.callback = callback;
  }

  // private

  onOpenHandler() {
    console.info('ws opened');
  }

  onMessageHandler(event) {
    if (event.data && this.callback) {
      this.callback(parse(event.data));
    }
  }

  onCloseHandler(event) {
    console.info('ws closed', event.code);

    if (1000 < event.code) {
      console.info('ws reconnect...');
      this.connect();
    }
  }

  // public

  connect() {
    this.ws = new WebSocket(locationReceiverUrl);

    this.ws.addEventListener('open', ::this.onOpenHandler, false);
    this.ws.addEventListener('close', ::this.onCloseHandler, false);
    this.ws.addEventListener('message', ::this.onMessageHandler, false);
  }

  disconnect() {
    this.ws.close();
  }
}
