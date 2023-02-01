import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { Table as PfTable, TableHeader } from '@patternfly/react-table';
import { render, screen, waitFor, fireEvent, act, configure } from '@testing-library/react';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { PipelineRunKind } from '../../../types';
import PipelineRunListRow from '../PipelineRunListRow';
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

configure({ testIdAttribute: 'data-test' });

jest.mock('../../../shared/components/table', () => {
  const actual = jest.requireActual('../../../shared/components/table');
  return {
    ...actual,
    Table: (props) => {
      const { data, filters, selected, match, kindObj } = props;
      const cProps = { data, filters, selected, match, kindObj };
      const columns = props.Header(cProps);
      return (
        <PfTable role="table" aria-label="table" cells={columns} variant="compact" borders={false}>
          <TableHeader role="rowgroup" />
          <tbody>
            {props.data.map((d, i) => (
              <tr key={i}>
                <PipelineRunListRow columns={null} obj={d} />
              </tr>
            ))}
          </tbody>
        </PfTable>
      );
    },
  };
});

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
      labels: {},
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
      labels: {},
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
      labels: {},
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

  it('should render correct columns when pipelineRuns are present', () => {
    watchResourceMock.mockReturnValue([pipelineRuns, true]);
    render(<PipelineRunsListView applicationName={appName} />);
    screen.getByText('Name');
    screen.getByText('Started');
    screen.getByText('Duration');
    screen.getAllByText('Status');
    screen.getByText('Type');
    screen.getByText('Component');
  });

  it('should render entire pipelineRuns list when no filter value', async () => {
    watchResourceMock.mockReturnValue([pipelineRuns, true]);
    render(<PipelineRunsListView applicationName={appName} />);
    await waitFor(() => {
      expect(screen.getByText('basic-node-js-first')).toBeInTheDocument;
      expect(screen.getByText('basic-node-js-second')).toBeInTheDocument;
      expect(screen.getByText('basic-node-js-third')).toBeInTheDocument;
    });
    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    expect(filter.value).toBe('');
  });

  it('should render filtered pipelinerun list', async () => {
    watchResourceMock.mockReturnValue([pipelineRuns, true]);
    render(<PipelineRunsListView applicationName={appName} />);
    await waitFor(() => {
      expect(screen.getByText('basic-node-js-first')).toBeInTheDocument;
    });

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'basic-node-js-second' },
      });
    });

    expect(screen.getByText('basic-node-js-first')).not.toBeInTheDocument;
    expect(screen.getByText('basic-node-js-second')).toBeInTheDocument;
    expect(screen.getByText('basic-node-js-third')).not.toBeInTheDocument;
  });

  it('should render no pipelineruns and Empty State', async () => {
    watchResourceMock.mockReturnValue([pipelineRuns, true]);
    render(<PipelineRunsListView applicationName={appName} />);
    await waitFor(() => {
      expect(screen.getByText('basic-node-js-first')).toBeInTheDocument;
    });

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    act(() => {
      fireEvent.change(filter, {
        target: { value: 'no-match' },
      });
    });

    await waitFor(() => {
      expect(filter.value).toBe('no-match');
    });

    expect(screen.getByText('basic-node-js-first')).not.toBeInTheDocument;
    expect(screen.getByText('basic-node-js-second')).not.toBeInTheDocument;
    expect(screen.getByText('basic-node-js-third')).not.toBeInTheDocument;
    expect(screen.findByTestId('filtered-empty-state')).toBeInTheDocument;
    expect(screen.findByText('No results found')).toBeInTheDocument;
    expect(
      screen.findByText(
        'No results match the filter criteria. Remove filters or clear all filters to show results',
      ),
    ).toBeInTheDocument;
  });
});
