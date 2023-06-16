import React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import '@testing-library/jest-dom';
import { getActiveWorkspace, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { useLatestApplicationRouteURL } from '../../../hooks/useLatestApplicationRouteURL';
import { EnvironmentModel } from '../../../models';
import { EnvironmentKind } from '../../../types';
import { EnvironmentType } from '../environment-utils';
import EnvironmentCard from '../EnvironmentCard';

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  commonFetch: jest.fn(),
  getActiveWorkspace: jest.fn(),
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../../hooks/useLatestApplicationRouteURL', () => ({
  useLatestApplicationRouteURL: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
  };
});

const useFeatureFlagMock = useFeatureFlag as jest.Mock;
useFeatureFlagMock.mockReturnValue([false, () => {}]);

const getActiveWorkspaceMock = getActiveWorkspace as jest.Mock;
getActiveWorkspaceMock.mockReturnValue('test-ws');

const useK8sWatchMock = useK8sWatchResource as jest.Mock;
const useLatestApplicationRouteURLMock = useLatestApplicationRouteURL as jest.Mock;

const testEnv: EnvironmentKind = {
  apiVersion: `${EnvironmentModel.apiGroup}/${EnvironmentModel.apiVersion}`,
  kind: EnvironmentModel.kind,
  metadata: {
    name: 'test',
  },
  spec: {
    displayName: 'My Env',
    type: 'poc',
    deploymentStrategy: 'Manual',
    tags: ['static'],
  },
};

describe('', () => {
  it('should render environment card', () => {
    render(<EnvironmentCard environment={testEnv} />);
    expect(screen.getByText('Static')).toBeVisible();
    expect(screen.getByText(testEnv.spec.displayName)).toBeVisible();
    expect(screen.queryByText(testEnv.metadata.name)).toBeNull();
    expect(screen.getByText('Manual')).toBeVisible();
  });

  it('should render environment metadata.name when displayName is absent', () => {
    const env = {
      ...testEnv,
      spec: {
        ...testEnv.spec,
        displayName: undefined,
      },
    };
    render(<EnvironmentCard environment={env} />);
    expect(screen.getByText(testEnv.metadata.name)).toBeVisible();
    expect(screen.queryByText(testEnv.spec.displayName)).toBeNull();
  });

  it('should render Application Healthy card in the list view', () => {
    const env = {
      ...testEnv,
      spec: {
        ...testEnv.spec,
        displayName: undefined,
      },
      healthStatus: 'Healthy',
    };
    render(<EnvironmentCard environment={env} />);
    expect(screen.getByText('Manual')).toBeVisible();
    expect(screen.getByText('Healthy')).toBeVisible();
  });

  it('should render Application count', () => {
    const env = {
      ...testEnv,
      spec: {
        ...testEnv.spec,
        displayName: undefined,
      },
    };
    useK8sWatchMock.mockReturnValue([[{ metadata: { name: 'test-app' } }], true]);
    render(<EnvironmentCard environment={env} />);
    expect(screen.getByText('Applications deployed')).toBeVisible();
    expect(screen.getByText('1 application')).toBeVisible();
  });

  it('should render Application Route URL', () => {
    const env = {
      ...testEnv,
      spec: {
        ...testEnv.spec,
        displayName: undefined,
      },
    };
    useK8sWatchMock.mockReturnValue([[{ metadata: { name: 'test-app' } }], true]);
    useLatestApplicationRouteURLMock.mockReturnValue('https://example.com/');
    render(<EnvironmentCard environment={env} applicationName="test" />);
    expect(screen.getByText('View URL')).toBeVisible();
    expect(screen.getByText('View URL')).toHaveProperty('href', 'https://example.com/');
  });

  it('should not render Application Route URL for managed environment', () => {
    const env = {
      ...testEnv,
      spec: {
        ...testEnv.spec,
        tags: [EnvironmentType.managed],

        displayName: undefined,
      },
    };
    useK8sWatchMock.mockReturnValue([[{ metadata: { name: 'test-app' } }], true]);
    useLatestApplicationRouteURLMock.mockReturnValue('https://example.com/');
    render(<EnvironmentCard environment={env} applicationName="test" />);
    screen.debug();
    expect(screen.queryByText('View URL')).not.toBeInTheDocument();
  });
});
