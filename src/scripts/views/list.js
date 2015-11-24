import { View } from 'backbone';
import template from './list.html';
import _ from 'underscore';

export class SithListView extends View {
  constructor(options) {
    super({
      ...options,
      tagName: 'section',
      className: 'css-scrollable-list',
      events: {
        'click .css-button-up': 'onScrollUp',
        'click .css-button-down': 'onScrollDown'
      }
    });

    this.template = _.template(template);
  }

  initialize() {
    const events = {
      'change scroll relocate': this.render
    };

    this.collection.on(events, this);
  }

  onScrollUp() {
    this.collection.scrollUp();
  }

  onScrollDown() {
    this.collection.scrollDown();
  }

  render() {
    const vars = {
      collection: this.collection.toJSON(),
      disableScrollUp: !this.collection.canScrollUp(),
      disableScrollDown: !this.collection.canScrollDown()
    };

    return this.$el.html(this.template(vars));
  }
}
