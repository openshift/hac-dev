import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, screen } from '@testing-library/react';
import { routerRenderer } from '../../../utils/test-utils';
import { MockSnapshots } from '../../Commits/CommitDetails/visualization/__data__/MockCommitWorkflowData';
import EnvironmentProvisionErrorAlert from '../EnvironmentProvisionErrorAlert';
import { getEnvironmentProvisionError } from '../utils/snapshot-utils';

configure({ testIdAttribute: 'data-test' });

describe('EnvironmentProvisionErrorAlert', () => {
  it('should show relevant Error Details Alert', () => {
    routerRenderer(
      <EnvironmentProvisionErrorAlert
        errorStatus={getEnvironmentProvisionError(MockSnapshots[1])}
      />,
    );
    screen.getByTestId(/env-provision-err-alert/);
    screen.getByText('app-sample-go-basic-enterprise-contract');
    screen.getByText(/Snapshot failed to deploy/);
    screen.getByText(/Sep 19, 2023/);
  });

  it('should show multiple scenarios for multiple failures', () => {
    routerRenderer(
      <EnvironmentProvisionErrorAlert
        errorStatus={getEnvironmentProvisionError(MockSnapshots[0])}
      />,
    );
    screen.getByTestId('env-provision-err-alert');
    screen.getByText(/app-sample-go-basic-enterprise-contract/);
    screen.getByText(/scn 2/);
  });

  it('should show multiple details for multiple failures', () => {
    routerRenderer(
      <EnvironmentProvisionErrorAlert
        errorStatus={getEnvironmentProvisionError(MockSnapshots[0])}
      />,
    );
    screen.getByText(/Snapshot failed to deploy/);
    screen.getByText(
      /Failed to find deploymentTargetClass with right provisioner for copy of existingEnvironment/,
    );
    screen.getByText(/could not find deployment/);
  });
});
