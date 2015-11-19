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
        'click .css-button-up': 'onScrollUp',
        'click .css-button-down': 'onScrollDown'
      }
    });

    this.template = _.template(template);
  }

  initialize() {
    //this.listenTo(this.collection, 'all', (event, ...args) => { console.log('->', event, args); });
    //this.listenTo(this.collection, '', this.render);
    this.listenTo(this.collection, 'change scroll', this.render);

    this.listenTo(this.collection, 'loadedUp', this.loadedUp);
    this.listenTo(this.collection, 'loadedDown', this.loadedDown);
  }

  onScrollUp() {
    this.collection.scrollUp();
  }

  onScrollDown() {
    this.collection.scrollDown();
  }

  loadedUp() {
    this.$('.css-button-up').addClass('css-button-disabled');
  }

  loadedDown() {
    this.$('.css-button-down').addClass('css-button-disabled');
  }

  render() {
    const vars = {
      lords: this.collection.pluck('data'),
      disableScrollUp: !this.collection.canScrollUp(),
      disableScrollDown: !this.collection.canScrollDown()
    };

    this.$el.html(
      this.template(vars)
    );

    return this.$el;
  }
}
