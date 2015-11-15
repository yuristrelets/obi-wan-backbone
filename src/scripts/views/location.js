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
    this.listenTo(this.model, 'change', this.render);
  }

  render() {
    this.$el.html(`Obi-Wan currently on ${this.model.get('name')}`);

    return this.$el;
  }
}
