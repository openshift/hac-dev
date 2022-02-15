import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useApplicationsInfo } from '../hooks/useApplicationsInfo';
import { LoadingBox } from '../shared/components/status-box/StatusBox';
import ApplicationList from './ApplicationListView/ApplicationList';

const AppFlow: React.FC = () => {
  const history = useHistory();
  const { loaded, appExists } = useApplicationsInfo();

  React.useEffect(() => {
    if (loaded && !appExists) {
      history.push('/create');
    }
  }, [appExists, history, loaded]);

  return !loaded ? (
    <LoadingBox />
  ) : (
    loaded && appExists && <ApplicationList data-test="app-list-view" />
  );
};

export default AppFlow;
