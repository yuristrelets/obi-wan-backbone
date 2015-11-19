import { Model } from 'backbone';
import $ from 'jquery';

export class LordModel extends Model {
  initialize() {
    this.on('remove', this.abort, this);
  }

  defaults() {
    return {
      query: null,
      data: null,
      loaded: false,
      selfUrl: null
    };
  };

  load() {
    const url = this.get('selfUrl');

    this.set({
      loading: true,
      query: $.get(url).done((data) => {
        this.set({
          data: data,
          loaded: true,
          loading: false,
          query: null
        });
      })
    });
  }

  abort() {
    console.log('abort');
    let query = this.get('query');

    if (query) {
      query.abort();
      this.clear({ silent: true });
    }
  }

  isEmpty() {
    return !this.has('selfUrl');
  }

  isLoaded() {
    return this.get('loaded');
  }

  isLoadable() {
    return !this.isLoaded() && !this.isEmpty() && !this.get('loading');
  }

  isFromWorld(worldName) {
    return this.has('homeworld') && this.get('homeworld') === worldName;
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

  getApprenticeUrl() {
    return this.hasApprentice() && this.get('data').apprentice.url;
  }

  getMasterUrl() {
    return this.hasMaster() && this.get('data').master.url;
  }
}
