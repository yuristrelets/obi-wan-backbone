import { View } from 'backbone';
import { LocationView } from '../views/location';
import { SithListView } from '../views/list';
import { LocationReceiver } from '../transports/location-receiver';
import { SithCollection } from '../collections/sith';
import { LocationModel } from '../models/location';
import conf from '../configs/app';

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

  initializeLocationReceiver() {
    this.locationReceiver = new LocationReceiver({
      url: conf.locationReceiverUrl,
      onNotify: this.onLocationReceived.bind(this)
    });

    this.locationReceiver.connect();
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
    return this.$el.append(
      this.locationView.render(),
      this.lordsListView.render()
    );
  }
}
