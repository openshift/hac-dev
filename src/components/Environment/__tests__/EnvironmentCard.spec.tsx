import React from 'react';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import '@testing-library/jest-dom';
import { getActiveWorkspace, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { EnvironmentModel } from '../../../models';
import { EnvironmentKind } from '../../../types';
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
    expect(screen.getByText('Applications Deployed')).toBeVisible();
    expect(screen.getByText('1 application')).toBeVisible();
  });
});
