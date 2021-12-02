import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import logger from 'redux-logger';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import App from './App';
import { init } from './store';

const AppEntry: React.FC = () => (
  <Provider store={init(...(process.env.NODE_ENV !== 'production' ? [logger] : [])).getStore()}>
    <Router basename={getBaseName(window.location.pathname)}>
      <App />
    </Router>
  </Provider>
);

export default AppEntry;
