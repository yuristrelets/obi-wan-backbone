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
    //this.listenTo(this.collection, 'all', (event, ...args) => { console.log('->', event, args); });

    this.collection.on('change scroll', this.render, this);
  }

  onScrollUp() {
    this.collection.scrollUp();
  }

  onScrollDown() {
    this.collection.scrollDown();
  }

  render() {
    const vars = {
      collection: this.collection,
      disableScrollUp: !this.collection.canScrollUp(),
      disableScrollDown: !this.collection.canScrollDown()
    };

    this.$el.html(
      this.template(vars)
    );

    return this.$el;
  }
}
