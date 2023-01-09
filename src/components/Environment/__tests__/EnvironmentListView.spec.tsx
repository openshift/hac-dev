import * as React from 'react';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { render, screen, configure } from '@testing-library/react';
import { useApplications } from '../../../hooks/useApplications';
import { EnvironmentKind } from '../../../types';
import { mockApplication } from '../../ApplicationEnvironment/__data__/mock-data';
import EnvironmentListView from '../EnvironmentListView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useSearchParams: () => React.useState(() => new URLSearchParams()),
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn(), disableTopics: jest.fn() },
  }),
}));

jest.mock('../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));
const useApplicationsMock = useApplications as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

const environments: EnvironmentKind[] = [
  {
    kind: 'Environment',
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    metadata: {
      name: 'prod',
      namespace: 'test',
    },
    spec: {
      displayName: 'Prod',
      deploymentStrategy: 'Manual',
      type: 'poc',
    },
  },
  {
    kind: 'Environment',
    apiVersion: 'appstudio.redhat.com/v1alpha1',
    metadata: {
      name: 'staging',
      namespace: 'test2',
    },
    spec: {
      displayName: 'Staging',
      deploymentStrategy: 'Manual',
      type: 'poc',
    },
  },
];

configure({ testIdAttribute: 'data-test' });

describe('EnvironmentListView', () => {
  beforeEach(() => {
    useApplicationsMock.mockReturnValue([[mockApplication], true]);
    useFeatureFlagMock.mockReturnValue([false]);
  });

  it('should render spinner while environment data is not loaded', () => {
    render(<EnvironmentListView environments={[]} environmentsLoaded={false} />);
    screen.getByRole('progressbar');
  });

  it('should render empty state if no environment is present', () => {
    render(<EnvironmentListView environments={[]} environmentsLoaded={true} />);
    screen.getByText('No Environments');
    screen.getByText('To get started, create an environment.');
    const button = screen.getByText('Create environment');
    expect(button).toBeInTheDocument();
  });

  it('should render application list when environment(s) is(are) present', () => {
    render(<EnvironmentListView environments={environments} environmentsLoaded={true} />);
    screen.getByText('Create environment');
    expect(screen.getAllByTestId('environment-card').length).toBe(2);
  });
});
