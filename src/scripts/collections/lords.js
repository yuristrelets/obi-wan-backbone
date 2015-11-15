import { Collection } from 'backbone';
import { LordModel } from '../models/lord';
import { lordsListMaxItems} from '../config';

export class LordsCollection extends Collection {
  constructor(models, options) {
    super(
      new Array(lordsListMaxItems),
      {
        ...options,
        model: LordModel
      }
    );
  }

  initialize() {
    //
  }

  hasLordFromLocation(location) {
    return false;
  }
}