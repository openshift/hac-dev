import * as React from 'react';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, configure } from '@testing-library/react';
import { useApplications } from '../../../hooks/useApplications';
import { EnvironmentKind } from '../../../types';
import { mockApplication } from '../../ApplicationDetails/__data__/mock-data';
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

jest.mock('../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

const useFeatureFlagMock = useFeatureFlag as jest.Mock;
useFeatureFlagMock.mockReturnValue([false, () => {}]);

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
    deploymentStrategy: 'Manual',
    type: 'poc',
  },
};
configure({ testIdAttribute: 'data-test' });

const watchResourceMock = useK8sWatchResource as jest.Mock;

const useApplicationsMock = useApplications as jest.Mock;

describe('EnvironmentCard', () => {
  it('should render correct CardBody sections', () => {
    watchResourceMock.mockReturnValue([[], true]);
    useApplicationsMock.mockReturnValue([[mockApplication], true]);
    render(<EnvironmentCard environment={environment} />);
    screen.getByText(environment.spec.displayName);
    screen.getByText('Applications: 1');
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
