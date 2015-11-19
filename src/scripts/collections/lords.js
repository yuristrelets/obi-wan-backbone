import { Collection } from 'backbone';
import { LordModel } from '../models/lord';
import { lordsListMaxItems, lordsListShiftCount, firstLordUrl } from '../config';
import $ from 'jquery';

export class LordsCollection extends Collection {
  constructor(models, options) {
    super(models, {
      ...options,
      model: LordModel
    });

    this.scrollItemsCount = options.scrollItemsCount || 1;
    this.locked = false;

    if (options.firstItemUrl) {
      this.loadSith(this.at(0), options.firstItemUrl);
    }
  }

  initialize() {
    this.on({
      'change:loaded': this.loadNextSith
    }, this);
  }

  loadSith(model, url) {
    model.set({
      selfUrl: url
    });

    model.load();
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

    const offset     = this.scrollItemsCount;
    const length     = this.length;
    const collection = new Array(offset).concat(this.models);

    this.scroll(collection.slice(0, length));
  }

  scrollDown() {
    if (!this.canScrollDown()) {
      return false;
    }

    const offset     = this.scrollItemsCount;
    const collection = this.models.slice().concat(new Array(offset));

    this.scroll(collection.slice(offset));
  }

  getSithFromWorld(world) {
    return this.filter((sith) => {
      return sith.isFromWorld(world.name);
    });
  }

  isLocked() {
    return this.locked;
  }

  lock(collection) {

  }

  canScrollUp() {
    return (
      !this.isLocked() &&
      this.filter((sith) => sith.isLoaded()).length >= 1 &&
      this.where({ loaded: true })[0].hasMaster()
    );
  }

  canScrollDown() {
    return (
      !this.isLocked() &&
      this.filter((sith) => sith.isLoaded()).length >= 1 &&
      this.where({ loaded: true }).reverse()[0].hasApprentice()
    );
  }
}