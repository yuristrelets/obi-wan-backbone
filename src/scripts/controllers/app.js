import { View } from 'backbone';
import { LocationView } from '../views/location';
import { LordsListView } from '../views/list';

import { LocationReceiver } from '../transports/location-receiver';

import { LocationModel } from '../models/location';
import { LordsCollection } from '../collections/lords';

import { lordsListMaxItems, lordsListShiftCount, firstLordUrl } from '../config';

export class AppController extends View {
  constructor(options) {
    super({
      ...options,
      className: 'css-root'
    });
  }

  initialize() {
    this.initializeLocationReceiver();
    this.initializeSithCollection();
    this.initializeViews();
  }

  initializeLocationReceiver() {
    this.locationReceiver = new LocationReceiver(::this.onLocationReceived);
    this.locationReceiver.connect();
  }

  initializeSithCollection() {
    this.sithCollection = new LordsCollection(
      new Array(lordsListMaxItems),
      {
        firstItemUrl: firstLordUrl,
        scrollItemsCount: lordsListShiftCount
      }
    );
  }

  initializeViews() {
    this.locationView = new LocationView({
      model: new LocationModel()
    });

    this.lordsListView = new LordsListView({
      collection: this.sithCollection
    });
  }

  remove() {
    super.remove();

    this.locationReceiver.disconnect();
  }

  onLocationReceived(world) {
    this.locationView.model.set(world);

    const localSith = this.sithCollection.getSithFromWorld(world);

    if (localSith.length) {
      console.log(localSith);
      this.sithCollection.lock(localSith);
    }
  }

  render() {
    this.$el.append(
      this.locationView.render(),
      this.lordsListView.render()
    );

    return this.$el;
  }
}
