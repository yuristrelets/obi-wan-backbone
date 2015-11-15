import { View } from 'backbone';
import template from './list.html';
import _ from 'underscore';

export class LordsListView extends View {
  constructor(options) {
    super({
      ...options,
      tagName: 'section',
      className: 'css-scrollable-list',
      events: {
        'click .css-button-up': 'onUp',
        'click .css-button-down': 'onDown'
      }
    });

    this.template = _.template(template);
  }

  initialize() {
    //
  }

  onUp() {
    console.log('up');
  }

  onDown() {
    console.log('down');
  }

  render() {
    this.$el.html(this.template());

    return this.$el;
  }
}
