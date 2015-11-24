import { Collection } from 'backbone';
import { SithModel } from '../models/sith';
import _ from 'underscore';

export class SithCollection extends Collection {
  constructor(models, { initUrl, shiftItemsCount = 1, ...options }) {
    super(models, {
      ...options,
      model: SithModel
    });

    this.scrollStep = shiftItemsCount;

    this.location = null;
    this.locked   = false;

    // load first model
    this.loadModel(this.at(0), initUrl);
  }

  initialize() {
    const events = {
      'change:id scroll relocate': this.update
    };

    this.on(events, this);
  }

  abort() {
    this.invoke('abort');
  }

  update() {
    // filter models by location
    const matched = this.filter(this.hasModelLocation.bind(this, this.location));

    // unmark models
    this.each(this.markModel.bind(this, false));
    this.setLocked(!!matched.length);

    if (!this.isLocked()) {
      return this.loadNextModel();
    }

    // abort requests and mark models
    this.abort();
    _.each(matched, this.markModel.bind(this, true));
  }

  loadModel(model, url) {
    model.setUrl(url);
    model.load();
  }

  loadNextModel() {
    this.each((model, index, collection) => {
      if (model.isLoaded()) {
        const prev = collection[index - 1];
        const next = collection[index + 1];

        if (prev && prev.isLoadable() && model.hasMaster()) {
          this.loadModel(prev, model.getMasterUrl());
        }

        if (next && next.isLoadable() && model.hasApprentice()) {
          this.loadModel(next, model.getApprenticeUrl());
        }
      }
    });
  }

  markModel(value, model) {
    model.setMarked(value);
  }

  hasModelLocation(location, model) {
    return model.hasLocation(location);
  }

  scrollUp() {
    if (!this.canScrollUp()) {
      return false;
    }

    const collection = [
      ...new Array(this.scrollStep),
      ...this.models
    ];

    this.set(collection.slice(0, this.length));
    this.trigger('scroll');
  }

  scrollDown() {
    if (!this.canScrollDown()) {
      return false;
    }

    const collection = [
      ...this.models,
      ...new Array(this.scrollStep)
    ];

    this.set(collection.slice(this.scrollStep));
    this.trigger('scroll');
  }

  // set

  setLocked(locked) {
    this.locked = locked;
  }

  setCurrentLocation(location) {
    this.location = location;

    this.trigger('relocate', this.location);
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
