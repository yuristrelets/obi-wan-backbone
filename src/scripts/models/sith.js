import { Model } from 'backbone';
import $ from 'jquery';

export class SithModel extends Model {
  defaults() {
    return {
      url: null,
      query: null,
      data: null,
      loaded: false
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
    const url = this.get('url');

    const handle = (data) => {
      this.set({
        data: data,
        loaded: true,
        loading: false,
        query: null
      });
    };

    this.set({
      loading: true,
      query: $.get(url).done(handle)
    });
  }

  abort() {
    let query = this.get('query');

    if (query) {
      query.abort();
      this.clear({ silent: true });
    }
  }

  // is

  isEmpty() {
    return !this.has('url');
  }

  isLoaded() {
    return this.get('loaded');
  }

  // has

  hasLocation(location) {
    return this.has('homeworld') && this.get('homeworld').id === location.id;
  }

  hasApprentice() {
    try {
      return !!this.get('data').apprentice.id;
    } catch (err) {
      return false;
    }
  }

  hasMaster() {
    try {
      return !!this.get('data').master.id;
    } catch (err) {
      return false;
    }
  }

  // get

  getApprenticeUrl() {
    return this.hasApprentice() && this.get('data').apprentice.url;
  }

  getMasterUrl() {
    return this.hasMaster() && this.get('data').master.url;
  }
}
