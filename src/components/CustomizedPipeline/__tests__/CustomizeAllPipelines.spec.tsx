import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render } from '@testing-library/react';
import CustomizeAllPipelines from '../CustomizeAllPipelines';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../hooks/useApplicationPipelineGitHubApp', () => ({
  useApplicationPipelineGitHubApp: jest.fn(() => ({
    name: 'test-app',
    url: 'https://github.com/test-app',
  })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

describe('CustomizeAllPipelines', () => {
  it('should render nothing while loading', () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    const result = render(
      <CustomizeAllPipelines applicationName="" namespace="" modalProps={{ isOpen: true }} />,
    );
    expect(result.baseElement.textContent).toBe('');
  });

  it('should render empty state', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    const result = render(
      <CustomizeAllPipelines applicationName="" namespace="" modalProps={{ isOpen: true }} />,
    );
    expect(result.getByText('No components')).toBeInTheDocument();
  });

  it('should render modal with components table', () => {
    useK8sWatchResourceMock.mockReturnValue([
      [
        {
          metadata: {
            name: 'my-component',
            annotations: {},
          },
          spec: {
            application: 'test',
            source: {
              git: {
                url: 'https://github.com/org/test',
              },
            },
          },
        },
      ],
      true,
    ]);
    const result = render(
      <CustomizeAllPipelines applicationName="test" namespace="" modalProps={{ isOpen: true }} />,
    );
    expect(result.getByTestId('component-row', { exact: false })).toBeInTheDocument();
  });

  it('should call filter function for each component', () => {
    const component1 = { metadata: { name: 'c1' }, spec: { application: 'test' } };
    const component2 = { metadata: { name: 'c2' }, spec: { application: 'test' } };
    const filter = jest.fn(() => false);
    useK8sWatchResourceMock.mockReturnValue([[component1, component2], true]);
    const result = render(
      <CustomizeAllPipelines
        applicationName="test"
        namespace=""
        filter={filter}
        modalProps={{ isOpen: true }}
      />,
    );

    expect(result.getByText('No components')).toBeInTheDocument();
    expect(result.queryByTestId('component-row', { exact: false })).not.toBeInTheDocument();
    expect(filter).toHaveBeenCalledTimes(2);
    expect(filter).toHaveBeenNthCalledWith(1, component1, expect.anything(), expect.anything());
    expect(filter).toHaveBeenNthCalledWith(2, component2, expect.anything(), expect.anything());
  });
});
