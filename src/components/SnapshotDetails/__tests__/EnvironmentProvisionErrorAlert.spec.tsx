import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, screen } from '@testing-library/react';
import { routerRenderer } from '../../../utils/test-utils';
import { MockSnapshots } from '../../Commits/CommitDetails/visualization/__data__/MockCommitWorkflowData';
import EnvironmentProvisionErrorAlert from '../EnvironmentProvisionErrorAlert';
import { getEnvironmentProvisionError } from '../utils/snapshot-utils';

configure({ testIdAttribute: 'data-test' });

describe('EnvironmentProvisionErrorAlert', () => {
  it('should return null when no ErrorStatus', () => {
    routerRenderer(<EnvironmentProvisionErrorAlert errorStatus={null} />);
    expect(screen.queryByTestId(/env-provision-err-alert/)).not.toBeInTheDocument();
  });

  it('should return for emoty array ErrorStatus', () => {
    routerRenderer(<EnvironmentProvisionErrorAlert errorStatus={[]} />);
    expect(screen.queryByTestId(/env-provision-err-alert/)).not.toBeInTheDocument();
  });

  it('should return error section as hidden initially', () => {
    routerRenderer(
      <EnvironmentProvisionErrorAlert
        errorStatus={getEnvironmentProvisionError(MockSnapshots[1])}
      />,
    );
    expect(
      screen
        .getByTestId('error-expandable-section')
        .children[0].children[0].children[0].getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('should show relevant Error Details Alert', () => {
    routerRenderer(
      <EnvironmentProvisionErrorAlert
        errorStatus={getEnvironmentProvisionError(MockSnapshots[1])}
      />,
    );
    expect(screen.getByTestId(/env-provision-err-alert/)).toBeInTheDocument();
    expect(screen.getByText('app-sample-go-basic-enterprise-contract')).toBeInTheDocument();
    expect(screen.getByText(/Snapshot failed to deploy/)).toBeInTheDocument();
    expect(screen.getByText(/Sep 19, 2023/)).toBeInTheDocument();
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
