import { View } from 'backbone';

export class LocationView extends View {
  constructor(options) {
    super({
      ...options,
      tagName: 'h1',
      className: 'css-planet-monitor'
    });
  }

  initialize() {
    const events = {
      'change': this.render
    };

    this.model.on(events, this);
  }

  render() {
    return this.$el.html(`Obi-Wan currently on ${this.model.get('name')}`);
  }
}
