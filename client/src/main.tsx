import './assets/styles/dots.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Application from './application';

ReactDOM.render(
  <BrowserRouter>
    <Application />
  </BrowserRouter>,
  document.getElementById('root'),
);
