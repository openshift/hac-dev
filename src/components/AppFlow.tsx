import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import SamplesFlow from './SamplesFlow';

const AppFlow: React.FC = () => {
  const history = useHistory();
  const [data, updateData] = useLocalStorage('userDetails', {
    firstLogin: true,
    lastViewedApp: '',
  });
  const { firstLogin, lastViewedApp } = data;
  if (firstLogin === false && lastViewedApp) {
    // show component list view
    history.push(`/components?application=${lastViewedApp}`);
  } else if (firstLogin === false) {
    //TODO: update to show application list view, falling back to create application as application list is not present
    history.push('/create-application');
  }
  updateData({ ...data, firstLogin: false });
  return <SamplesFlow />;
};

export default AppFlow;
