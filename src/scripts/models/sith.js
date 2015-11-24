import { Model } from 'backbone';
import $ from 'jquery';

export class SithModel extends Model {
  defaults() {
    return {
      id: null,
      name: null,
      url: null,
      master: {},
      apprentice: {},
      homeworld: {},
      request: null,
      marked: false
    };
  };

  initialize() {
    const events = {
      remove: this.abort
    };

    this.on(events, this);
  }

  load() {
    const url = this.getUrl();
    const handler = (data) => this.set({ ...data, request: null });

    this.set({
      request: $.get(url).done(handler)
    });
  }

  abort() {
    if (this.isLoading()) {
      this.getRequest().abort();
      this.set({ request: null }, { silent: true });
    }
  }

  // get

  getUrl() {
    return this.get('url');
  }

  getApprenticeUrl() {
    return this.get('apprentice').url;
  }

  getMasterUrl() {
    return this.get('master').url;
  }

  getRequest() {
    return this.get('request');
  }

  // set

  setUrl(value) {
    this.set('url', value);
  }

  setMarked(value) {
    this.set('marked', value);
  }

  // has

  hasLocation(location) {
    return this.get('homeworld').id === location.id;
  }

  hasApprentice() {
    return !!this.get('apprentice').id;
  }

  hasMaster() {
    return !!this.get('master').id;
  }

  // is

  isLoaded() {
    return this.has('id');
  }

  isLoading() {
    return this.has('request');
  }

  isLoadable() {
    return !this.isLoaded() && !this.isLoading();
  }
}
