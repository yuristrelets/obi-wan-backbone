import { Model } from 'backbone';

export class LordModel extends Model {
  defaults() {
    return {
      id: null,
      name: 'Dark'
    };
  };
}
