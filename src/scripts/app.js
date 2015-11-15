import '../styles/app.less';

import { AppController } from './controllers/app';
import $ from 'jquery';

$('#app').html(
  new AppController().render()
);
