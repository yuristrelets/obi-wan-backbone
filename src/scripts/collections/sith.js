import { Collection } from 'backbone';
import { SithModel } from '../models/sith';

export class SithCollection extends Collection {
  constructor(models, options) {
    super(models, {
      ...options,
      model: SithModel
    });

    this.shiftItemsCount = options.shiftItemsCount || 1;
    this.locked           = false;

    if (options.initUrl) {
      this.loadInitialSith(options.initUrl);
    }
  }

  initialize() {
    this.on({
      'change:loaded': this.loadNextSith
    }, this);
  }

  loadSith(model, url) {
    model.url = url;
  }

  loadInitialSith(url) {
    this.loadSith(this.at(0), url);
  }

  loadNextSith() {
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
    this.set(collection);
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

  getSithFromLocation(location) {
    return this.filter((sith) => sith.hasLocation(location));
  }

  isLocked() {
    return this.locked;
  }

  setLock(collection) {

  }

  setCurrentWorld(world) {

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