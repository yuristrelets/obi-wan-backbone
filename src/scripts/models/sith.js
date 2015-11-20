import { Model } from 'backbone';
import $ from 'jquery';

export class SithModel extends Model {
  defaults() {
    return {
      url: null,
      query: null,
      data: null,
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
      query: $.get(this.url).done(handle)
    });
  }

  abort() {
    let query = this.get('query');

    if (query) {
      query.abort();
      this.clear({ silent: true });
    }
  }

  get url() {
    return this.get('url');
  }

  set url(value) {
    this.set('url', value);
  }

  get marked() {
    return this.get('marked');
  }

  set marked(value) {
    this.set('marked', value);
  }

  get data() {
    return this.get('data');
  }

  get location() {
    return this.data && this.data.homeworld;
  }

  get master() {
    return this.data && this.data.master;
  }

  get apprentice() {
    return this.data && this.data.apprentice;
  }

  get query() {
    return this.get('query');
  }

  // is

  isEmpty() {
    return !this.url;
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
    return this.apprentice && this.apprentice.id;
  }

  hasMaster() {
    return this.master && this.master.id;
  }

  // get

  getApprenticeUrl() {
    return this.hasApprentice() && this.get('data').apprentice.url;
  }

  getMasterUrl() {
    return this.hasMaster() && this.get('data').master.url;
  }
}
