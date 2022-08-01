import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, configure } from '@testing-library/react';
import { EnvironmentKind } from '../../../types';
import EnvironmentCard from '../EnvironmentCard';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

const environment: EnvironmentKind = {
  kind: 'Environment',
  apiVersion: 'appstudio.redhat.com/v1alpha1',
  metadata: {
    name: 'prod',
    namespace: 'abhi',
    resourceVersion: '187593762',
    uid: '60725777-a545-4c54-bf25-19a3f231aed1',
  },
  spec: {
    displayName: 'Prod',
    clusterCredentials: {
      apiServerURL: 'link1',
    },
    deploymentStrategy: 'manual',
  },
};
configure({ testIdAttribute: 'data-test' });

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('EnvironmentCard', () => {
  it('should render correct CardBody sections', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<EnvironmentCard environment={environment} />);
    screen.getByText(environment.spec.displayName);
    screen.getByText('Applications: 4');
  });

  it('should render correct Deployment strategy CardBody sections', () => {
    watchResourceMock.mockReturnValue([[], true]);
    environment.spec.deploymentStrategy = 'AppStudioAutomated';
    render(<EnvironmentCard environment={environment} />);
    screen.getByText(environment.spec.displayName);
    screen.getByText('Deployment strategy:');
    screen.getByText('Automatic');
  });
});
