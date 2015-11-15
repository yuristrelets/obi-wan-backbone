import { View } from 'backbone';
import { LocationView } from '../views/location';
import { LordsListView } from '../views/list';

import { LocationReceiver } from '../transports/location-receiver';

import { LocationModel } from '../models/location';
import { LordsCollection } from '../collections/lords';

export class AppController extends View {
  constructor(options) {
    super({
      ...options,
      className: 'css-root'
    });
  }

  initialize() {
    this.initializeViews();

    this.locationReceiver = new LocationReceiver(::this.onLocationReceived);
    this.locationReceiver.connect();
  }

  initializeViews() {
    this.locationView = new LocationView({
      model: new LocationModel()
    });

    this.lordsListView = new LordsListView({
      collection: new LordsCollection()
    });
  }

  remove() {
    super.remove();

    this.locationReceiver.disconnect();
  }

  onLocationReceived(location) {
    this.locationView.model.set(location);
  }

  render() {
    console.log(this.lordsListView.collection);

    this.$el.append(
      this.locationView.render(),
      this.lordsListView.render()
    );

    return this.$el;
  }
}
