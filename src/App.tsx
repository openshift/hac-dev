import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import './App.scss';

import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

const App: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const registry = getRegistry();
    registry.register({ notifications: notificationsReducer });
    window.insights?.chrome?.init();

    // TODO change this to your appname
    window.insights?.chrome?.identifyApp('hac-dev');
    const unregister = window.insights?.chrome?.on('APP_NAVIGATION', (event) =>
      history.push(`/${event.navId}`),
    );
    return () => {
      unregister();
    };
  }, [history]);

  return (
    <Fragment>
      <NotificationsPortal />
      <Routes />
    </Fragment>
  );
};

export default App;
