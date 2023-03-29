import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render } from '@testing-library/react';
import { ComponentKind } from '../../../types';
import CustomizeComponentPipeline from '../CustomizeComponentPipeline';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../hooks/useStoneSoupGitHubApp', () => ({
  useStoneSoupGitHubApp: jest.fn(() => ({ name: 'test-app', url: 'https://github.com/test-app' })),
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

const mockComponent = {
  metadata: {
    name: `my-component`,
  },
  spec: {
    source: {
      git: {
        url: 'https://github.com/org/test',
      },
    },
  },
} as any as ComponentKind;

describe('CustomizeAllPipelines', () => {
  it('should render nothing while loading', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([{}, false]);
    const result = render(<CustomizeComponentPipeline name="my-component" namespace="test" />);
    expect(result.baseElement.textContent).toBe('');
  });

  it('should render modal with components table', () => {
    useK8sWatchResourceMock.mockReturnValueOnce([mockComponent, true]);
    const result = render(<CustomizeComponentPipeline name="my-component" namespace="test" />);
    expect(result.getByTestId('component-row', { exact: false })).toBeInTheDocument();
  });
});
