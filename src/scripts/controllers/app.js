import { View } from 'backbone';
import { LocationView } from '../views/location';
import { SithListView } from '../views/list';
import { LocationReceiver } from '../transports/location-receiver';
import { SithCollection } from '../collections/sith';
import { LocationModel } from '../models/location';
import conf from '../config';

export class AppController extends View {
  constructor(options) {
    super({
      ...options,
      className: 'css-root'
    });
  }

  initialize() {
    this.initializeCollections();
    this.initializeLocationReceiver();
    this.initializeViews();
  }

  initializeLocationReceiver() {
    this.locationReceiver = new LocationReceiver({
      url: conf.locationReceiverUrl,
      onNotify: this.onLocationReceived.bind(this)
    });

    this.locationReceiver.connect();
  }

  initializeCollections() {
    this.locationModel = new LocationModel();

    this.sithCollection = new SithCollection(
      new Array(conf.sithCollectionMaxItems),
      {
        initUrl: conf.sithInitUrl,
        shiftItemsCount: conf.sithCollectionShiftItems
      }
    );
  }

  initializeViews() {
    this.locationView = new LocationView({
      model: this.locationModel
    });

    this.lordsListView = new SithListView({
      collection: this.sithCollection
    });
  }

  remove() {
    super.remove();

    this.locationReceiver.disconnect();
    this.sithCollection.abort();
  }

  onLocationReceived(location) {
    this.locationModel.set(location);
    this.sithCollection.setCurrentLocation(location);
  }

  render() {
    this.$el.append(
      this.locationView.render(),
      this.lordsListView.render()
    );

    return this.$el;
  }
}
