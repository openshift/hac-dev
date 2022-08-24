import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, configure } from '@testing-library/react';
import { EnvironmentKind } from '../../../types';
import EnvironmentListView from '../EnvironmentListView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn(), disableTopics: jest.fn() },
  }),
}));

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
    },
  },
];

configure({ testIdAttribute: 'data-test' });

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('EnvironmentListView', () => {
  it('should render spinner while environment data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<EnvironmentListView />);
    screen.getByRole('progressbar');
  });

  it('should render empty state if no environment is present', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<EnvironmentListView />);
    screen.getByText('No Environments');
    screen.getByText('To get started, create an environment.');
    const button = screen.getByText('Create Environment');
    expect(button).toBeInTheDocument();
  });

  it('should render application list when environment(s) is(are) present', () => {
    watchResourceMock.mockReturnValue([environments, true]);
    render(<EnvironmentListView />);
    screen.getByText('Create Environment');
    expect(screen.getAllByTestId('environment-card').length).toBe(2);
  });
});
