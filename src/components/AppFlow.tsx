import * as React from 'react';
import { useHistory } from 'react-router-dom';
import AppBanner from '../AppBanner';
import { useApplicationsInfo } from '../hooks/useApplicationsInfo';
import { LoadingBox } from '../shared/components/status-box/StatusBox';
import ApplicationList from './ApplicationListView/ApplicationList';

import '../App.scss';
import '../shared/style.scss';

const AppFlow: React.FC = () => {
  const history = useHistory();
  const { loaded, appExists } = useApplicationsInfo();

  React.useEffect(() => {
    if (loaded && !appExists) {
      history.push('/create');
    }
  }, [appExists, history, loaded]);

  return (
    <React.Fragment>
      <AppBanner />
      {!loaded ? (
        <LoadingBox />
      ) : (
        loaded && appExists && <ApplicationList data-test="app-list-view" />
      )}
    </React.Fragment>
  );
};

export default AppFlow;
