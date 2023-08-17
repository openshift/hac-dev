import * as React from 'react';
import '@testing-library/jest-dom';
import { Table as PfTable, TableHeader } from '@patternfly/react-table';
import { render, screen, fireEvent, configure, waitFor } from '@testing-library/react';
import { useComponents } from '../../../hooks/useComponents';
import { usePipelineRuns } from '../../../hooks/usePipelineRuns';
import { usePLRVulnerabilities } from '../../../hooks/useScanResults';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { PipelineRunKind } from '../../../types';
import { mockComponentsData } from '../../ApplicationDetails/__data__';
import { PipelineRunListRow } from '../PipelineRunListRow';
import PipelineRunsListView from '../PipelineRunsListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../hooks/usePipelineRuns', () => ({
  usePipelineRuns: jest.fn(),
}));
jest.mock('../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../hooks/useScanResults', () => ({
  usePLRVulnerabilities: jest.fn(() => ({ vulnerabilities: {}, fetchedPipelineRuns: [] })),
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

      React.useEffect(() => {
        props?.onRowsRendered({ stopIndex: data.length - 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [data]);
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

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const useSearchParamMock = useSearchParam as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;
const usePLRVulnerabilitiesMock = usePLRVulnerabilities as jest.Mock;
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

const usePipelineRunsMock = usePipelineRuns as jest.Mock;

describe('Pipeline run List', () => {
  beforeEach(() => {
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    useComponentsMock.mockReturnValue([mockComponentsData, true]);
  });

  it('should render spinner if application data is not loaded', () => {
    usePipelineRunsMock.mockReturnValue([[], false]);
    render(<PipelineRunsListView applicationName={appName} />);
    screen.getByRole('progressbar');
  });

  it('should render empty state if no application is present', () => {
    usePipelineRunsMock.mockReturnValue([[], true]);
    render(<PipelineRunsListView applicationName={appName} />);
    screen.queryByText(/Keep tabs on components and activity/);
    screen.queryByText(/Monitor your components with pipelines and oversee CI\/CD activity./);
    const button = screen.queryByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toContain(
      `http://localhost/application-pipeline/workspaces/test-ws/import?application=my-test-app`,
    );
  });

  it('should render correct columns when pipelineRuns are present', () => {
    usePipelineRunsMock.mockReturnValue([pipelineRuns, true]);
    render(<PipelineRunsListView applicationName={appName} />);
    screen.queryByText('Name');
    screen.queryByText('Started');
    screen.queryByText('Duration');
    screen.queryAllByText('Status');
    screen.queryByText('Type');
    screen.queryByText('Component');
  });

  it('should render entire pipelineRuns list when no filter value', async () => {
    usePipelineRunsMock.mockReturnValue([pipelineRuns, true]);
    render(<PipelineRunsListView applicationName={appName} />);
    expect(screen.queryByText('basic-node-js-first')).toBeInTheDocument();
    expect(screen.queryByText('basic-node-js-second')).toBeInTheDocument();
    expect(screen.queryByText('basic-node-js-third')).toBeInTheDocument();
    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    expect(filter.value).toBe('');
  });

  it('should render filtered pipelinerun list and should call nextPage', async () => {
    const nextPage = jest.fn();
    usePipelineRunsMock.mockReturnValue([pipelineRuns, true, null, nextPage]);

    const r = render(<PipelineRunsListView applicationName={appName} />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    fireEvent.change(filter, {
      target: { value: 'basic-node-js-second' },
    });

    usePLRVulnerabilitiesMock.mockReturnValue({
      vulnerabilities: {},
      fetchedPipelineRuns: pipelineRuns.map((plr) => plr.metadata.name),
    });
    expect(filter.value).toBe('basic-node-js-second');

    r.rerender(<PipelineRunsListView applicationName={appName} />);
    await waitFor(() => {
      expect(screen.queryByText('basic-node-js-first')).not.toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-second')).toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-third')).not.toBeInTheDocument();
      expect(nextPage).toHaveBeenCalled();
    });
  });

  it('should render no pipelineruns and Empty State', async () => {
    usePipelineRunsMock.mockReturnValue([pipelineRuns, true]);
    const r = render(<PipelineRunsListView applicationName={appName} />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');

    fireEvent.change(filter, {
      target: { value: 'no-match' },
    });

    expect(filter.value).toBe('no-match');

    r.rerender(<PipelineRunsListView applicationName={appName} />);
    await waitFor(() => {
      expect(screen.queryByText('basic-node-js-first')).not.toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-second')).not.toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-third')).not.toBeInTheDocument();
      expect(screen.queryByText('No results found')).toBeInTheDocument();
      expect(
        screen.queryByText(
          'No results match this filter criteria. Clear all filters and try again.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should clear the filters and render the list again in the table', async () => {
    usePipelineRunsMock.mockReturnValue([pipelineRuns, true]);
    const r = render(<PipelineRunsListView applicationName={appName} />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');

    fireEvent.change(filter, {
      target: { value: 'no-match' },
    });

    expect(filter.value).toBe('no-match');

    r.rerender(<PipelineRunsListView applicationName={appName} />);
    await waitFor(() => {
      expect(screen.queryByText('basic-node-js-first')).not.toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-second')).not.toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-third')).not.toBeInTheDocument();
      expect(screen.queryByText('No results found')).toBeInTheDocument();
      expect(
        screen.queryByText(
          'No results match this filter criteria. Clear all filters and try again.',
        ),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.queryByRole('button', { name: 'Clear all filters' }));
    await waitFor(() => {
      expect(screen.queryByText('basic-node-js-first')).toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-second')).toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-third')).toBeInTheDocument();
      screen.debug();
    });
  });
});
