import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen } from '@testing-library/react';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { PipelineRunKind } from '../../../types';
import PipelineRunsListView from '../PipelineRunsListView';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

const useSearchParamMock = useSearchParam as jest.Mock;

const params: any = {};

const mockUseSearchParam = (name: string) => {
  const setter = (value) => {
    params[name] = value;
  };
  const unset = () => {
    params[name] = '';
  };
  return [params[name], setter, unset];
};

const appName = 'my-test-app';

const pipelineRuns: PipelineRunKind[] = [
  {
    kind: 'PipelineRun',
    apiVersion: 'tekton.dev/v1beta1',
    metadata: {
      creationTimestamp: '2022-08-04T16:23:43Z',
      finalizers: Array['chains.tekton.dev/pipelinerun'],
      name: 'basic-node-js-first',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'basic-node-js',
          uid: '6b79df0c-1bee-40c0-81ee-7c4d1c9a422f',
        },
      ],
      resourceVersion: '497868251',
      uid: '9c1f121c-1eb6-490f-b2d9-befbfc658df1',
    },
    spec: {
      key: 'key1',
    },
  },
  {
    kind: 'PipelineRun',
    apiVersion: 'tekton.dev/v1beta1',
    metadata: {
      creationTimestamp: '2022-08-04T16:23:43Z',
      finalizers: Array['chains.tekton.dev/pipelinerun'],
      name: 'basic-node-js-second',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'basic-node-js',
          uid: '6b79df0c-1bee-40c0-81ee-7c4d1c9a422f',
        },
      ],
      resourceVersion: '497868252',
      uid: '9c1f121c-1eb6-490f-b2d9-befbfc658dfb',
    },
    spec: {
      key: 'key2',
    },
  },
  {
    kind: 'PipelineRun',
    apiVersion: 'tekton.dev/v1beta1',
    metadata: {
      creationTimestamp: '2022-08-04T16:23:43Z',
      finalizers: Array['chains.tekton.dev/pipelinerun'],
      name: 'basic-node-js-third',
      namespace: 'test',
      ownerReferences: [
        {
          apiVersion: 'appstudio.redhat.com/v1alpha1',
          kind: 'Component',
          name: 'basic-node-js',
          uid: '6b79df0c-1bee-40c0-81ee-7c4d1c9a422f',
        },
      ],
      resourceVersion: '497868253',
      uid: '9c1f121c-1eb6-490f-b2d9-befbfc658dfc',
    },
    spec: {
      key: 'key3',
    },
  },
];

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('Pipeline run List', () => {
  beforeEach(() => {
    useSearchParamMock.mockImplementation(mockUseSearchParam);
  });

  it('should render spinner if application data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<PipelineRunsListView applicationName={appName} />);
    screen.getByRole('progressbar');
  });

  it('should render empty state if no application is present', () => {
    watchResourceMock.mockReturnValue([[], true]);
    render(<PipelineRunsListView applicationName={appName} />);
    screen.getByText(/No pipeline run triggered yet./);
    screen.getByText(
      /To get started, create components and merge their pull request for build pipeline/,
    );
    const button = screen.getByText('Go to components tab');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toContain(`/stonesoup/applications/${appName}/components`);
  });

  it('should render pipelineRuns list when pipelineRuns are present', () => {
    watchResourceMock.mockReturnValue([pipelineRuns, true]);
    render(<PipelineRunsListView applicationName={appName} />);
    screen.getByText('Name');
    screen.getByText('Started');
    screen.getByText('Duration');
    screen.getAllByText('Status');
    screen.getByText('Type');
    screen.getByText('Component');
  });
});
