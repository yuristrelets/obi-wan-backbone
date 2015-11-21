import { Model } from 'backbone';
import $ from 'jquery';

export class SithModel extends Model {
  defaults() {
    return {
      url: null,
      query: null,
      data: {},
      loaded: false,
      loading: false,
      marked: false
    };
  };

  initialize() {
    const events = {
      'change:url': this.load,
      remove: this.abort
    };

    this.on(events, this);
  }

  //

  load() {
    const handle = (data) => this.set({
      data: data,
      loaded: true,
      loading: false,
      query: null
    });

    this.set({
      loading: true,
      query: $.get(this.getUrl()).done(handle)
    });
  }

  abort() {
    let query = this.get('query');

    if (query) {
      query.abort();
      this.clear({ silent: true });
    }
  }

  //

  getUrl() {
    return this.get('url');
  }

  setUrl(value) {
    this.set('url', value);
  }

  // TODO: downgrade this block to getters/setters

  get marked() {
    return this.get('marked');
  }

  set marked(value) {
    this.set('marked', value);
  }

  get loaded() {
    return this.get('loaded');
  }

  get data() {
    return this.get('data');
  }

  get query() {
    return this.get('query');
  }

  get location() {
    return this.data.homeworld;
  }

  // is

  isEmpty() {
    return !this.getUrl();
  }

  isLoaded() {
    return this.get('loaded');
  }

  // has

  hasLocation(location) {
    if (this.location) {
      return this.location.id === location.id;
    }

    return false;
  }

  hasApprentice() {
    return this.data.apprentice && this.data.apprentice.id;
  }

  hasMaster() {
    return this.data.master && this.data.master.id;
  }

  // get

  getApprenticeUrl() {
    return this.hasApprentice() && this.data.apprentice.url;
  }

  getMasterUrl() {
    return this.hasMaster() && this.data.master.url;
  }
}
