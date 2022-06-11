import 'normalize.css';
import '../scss/style.scss';

import {GitRepView} from './GitRepView.js'

let main = document.querySelector('main');

new GitRepView(main);