import { Model } from 'backbone';

export class LocationModel extends Model {
  defaults() {
    return {
      id: null,
      name: ''
    };
  };
}
