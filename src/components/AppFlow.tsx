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
      history.push('/app-studio/create');
    }
  }, [appExists, history, loaded]);

  return (
    <React.Fragment>
      {!loaded ? (
        <LoadingBox />
      ) : (
        loaded && appExists && <ApplicationList data-test="app-list-view" />
      )}
    </React.Fragment>
  );
};

export default AppFlow;
