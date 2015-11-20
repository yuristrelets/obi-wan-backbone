const WS_CLOSE_NORMAL = 1000;

const parse = JSON.parse;
const log   = console.info.bind(console);

export class LocationReceiver {
  constructor(options) {
    this.ws = null;

    this.url      = options.url;
    this.callback = options.onNotify;
  }

  // private

  onOpen() {
    log('ws opened');
  }

  onMessage(event) {
    if (event.data && this.callback) {
      this.callback(parse(event.data));
    }
  }

  onClose(event) {
    log('ws closed', event.code);

    if (WS_CLOSE_NORMAL < event.code) {
      log('ws reconnect...');
      this.connect();
    }
  }

  // public

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('open', this.onOpen.bind(this), false);
    this.ws.addEventListener('close', this.onClose.bind(this), false);
    this.ws.addEventListener('message', this.onMessage.bind(this), false);
  }

  disconnect() {
    this.ws.close();
  }
}
