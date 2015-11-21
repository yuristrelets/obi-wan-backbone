import { Collection } from 'backbone';
import { SithModel } from '../models/sith';
import _ from 'underscore';

export class SithCollection extends Collection {
  constructor(models, options) {
    super(models, {
      ...options,
      model: SithModel
    });

    this.shiftItemsCount = options.shiftItemsCount || 1;
    this.currentLocation = null;
    this.locked          = false;

    if (options.initUrl) {
      this.loadInitialSith(options.initUrl);
    }
  }

  initialize() {
    this.on({
      'change:loaded': this.onSithLoaded
    }, this);
  }

  //

  onSithLoaded(model, value) {
    if (value) {
      this.checkCurrentLocation();
      this.loadNextSith();
    }
  }

  //

  loadSith(model, url) {
    model.setUrl(url);
  }

  loadInitialSith(url) {
    this.loadSith(this.at(0), url);
  }

  loadNextSith() {
    if (this.isLocked()) {
      return;
    }

    this.each((model, index, collection) => {
      if (model.isLoaded()) {
        const prev = collection[index - 1];
        const next = collection[index + 1];

        if (prev && prev.isEmpty() && model.hasMaster()) {
          this.loadSith(prev, model.getMasterUrl());
        }

        if (next && next.isEmpty() && model.hasApprentice()) {
          this.loadSith(next, model.getApprenticeUrl());
        }
      }
    });
  }

  scroll(collection) {
    this.set(collection, { silent: true });
    this.trigger('scroll');
    this.loadNextSith();
  }

  scrollUp() {
    if (!this.canScrollUp()) {
      return false;
    }

    const offset     = this.shiftItemsCount;
    const collection = new Array(offset).concat(this.models);

    this.scroll(collection.slice(0, this.length));
  }

  scrollDown() {
    if (!this.canScrollDown()) {
      return false;
    }

    const offset     = this.shiftItemsCount;
    const collection = this.models.slice().concat(new Array(offset));

    this.scroll(collection.slice(offset));
  }

  resume() {
    this.loadNextSith();
  }

  abort(models = null) {
    _.invoke((models || this.models), 'abort');

    return this;
  }

  mark(value, models = null) {
    (models || this.models).forEach((model) => {
      model.marked = value;
    });

    return this;
  }

  checkCurrentLocation() {
    const models = this.getByLocation(this.currentLocation);

    this.setLock(!!models.length, models);
  }

  // get

  getByLocation(location) {
    return this.filter((sith) => sith.hasLocation(location));
  }

  // set

  setCurrentLocation(location) {
    this.currentLocation = location;

    this.checkCurrentLocation();
  }

  setLock(value, models = null) {
    this.locked = value;
    this.mark(false);

    if (this.locked) {
      this.abort().mark(true, models);
    } else {
      this.resume();
    }
  }

  // is

  isLocked() {
    return this.locked;
  }

  // can

  canScrollUp() {
    const first = this.first();

    return !this.isLocked() && first.isLoaded() && first.hasMaster();
  }

  canScrollDown() {
    const last = this.last();

    return !this.isLocked() && last.isLoaded() && last.hasApprentice();
  }
}