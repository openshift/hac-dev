import * as React from 'react';
import '@testing-library/jest-dom';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import { render, screen, fireEvent, configure, waitFor, cleanup } from '@testing-library/react';
import { PipelineRunLabel, PipelineRunType } from '../../../consts/pipelinerun';
import { useComponents } from '../../../hooks/useComponents';
import { usePipelineRuns } from '../../../hooks/usePipelineRuns';
import { usePLRVulnerabilities } from '../../../hooks/useScanResults';
import { useSearchParam } from '../../../hooks/useSearchParam';
import { useSnapshots } from '../../../hooks/useSnapshots';
import { PipelineRunKind, PipelineRunStatus } from '../../../types';
import { mockComponentsData } from '../../ApplicationDetails/__data__';
import { PipelineRunListRow } from '../PipelineRunListRow';
import PipelineRunsListView from '../PipelineRunsListView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../hooks/usePipelineRuns', () => ({
  usePipelineRuns: jest.fn(),
}));

jest.mock('../../../hooks/useApplications', () => ({
  useApplication: jest.fn().mockReturnValue([{ metadata: { name: 'test' } }, true]),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../hooks/useScanResults', () => ({
  usePLRVulnerabilities: jest.fn(() => ({ vulnerabilities: {}, fetchedPipelineRuns: [] })),
}));

jest.mock('../../../hooks/useComponents', () => ({
  useComponents: jest.fn().mockReturnValue([[], true]),
  useComponent: jest.fn().mockReturnValue([{ metadata: { name: { test } } }, true]),
}));

jest.mock('../../../hooks/useSnapshots', () => ({
  useSnapshots: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useNavigate: jest.fn(),
  };
});

jest.mock('../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

jest.mock('../../../shared/components/table/TableComponent', () => {
  return (props) => {
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
  };
});

jest.mock('../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

const useSearchParamMock = useSearchParam as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;
const usePLRVulnerabilitiesMock = usePLRVulnerabilities as jest.Mock;
const mockUseSnapshots = useSnapshots as jest.Mock;

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
      labels: {
        'appstudio.openshift.io/component': 'sample-component',
        [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.TEST as string,
      },
    },
    spec: {
      key: 'key1',
    },
    status: {
      conditions: [
        {
          status: 'True',
          type: 'Succeeded',
        },
      ],
    } as PipelineRunStatus,
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
      labels: {
        'appstudio.openshift.io/component': 'test-component',
        [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD as string,
      },
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
      labels: {
        'appstudio.openshift.io/component': 'sample-component',
        [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD as string,
      },
    },
    spec: {
      key: 'key3',
    },
  },
];

const usePipelineRunsMock = usePipelineRuns as jest.Mock;

configure({ testIdAttribute: 'data-testId' });

describe('Pipeline run List', () => {
  beforeEach(() => {
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    useComponentsMock.mockReturnValue([mockComponentsData, true]);
    mockUseSnapshots.mockReturnValue([[{ metadata: { name: 'snp1' } }], true]);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render spinner if application data is not loaded', () => {
    usePipelineRunsMock.mockReturnValue([[], false]);
    render(<PipelineRunsListView applicationName={appName} />);
    screen.getByTestId('data-table-skeleton');
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

  it('should render error state when there is an API error', () => {
    usePipelineRunsMock.mockReturnValue([[], true, new Error('500: Internal server error')]);
    render(<PipelineRunsListView applicationName="purple-mermaid-app" />);
    screen.getByText('Unable to load pipeline runs');
  });

  it('should render correct columns when pipelineRuns are present', () => {
    usePipelineRunsMock.mockReturnValue([pipelineRuns, true]);
    render(<PipelineRunsListView applicationName={appName} />);
    screen.queryByText('Name');
    screen.queryByText('Started');
    screen.queryByText('Duration');
    screen.queryAllByText('Status');
    screen.queryAllByText('Type');
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
    expect(screen.getByText('basic-node-js-first'));

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

  it('should render filtered pipelinerun list by name', async () => {
    usePipelineRunsMock.mockReturnValue([pipelineRuns, true]);
    const r = render(<PipelineRunsListView applicationName={appName} />);

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');

    fireEvent.change(filter, {
      target: { value: 'basic-node-js-first' },
    });

    expect(filter.value).toBe('basic-node-js-first');

    r.rerender(<PipelineRunsListView applicationName={appName} />);
    await waitFor(() => {
      expect(screen.queryByText('basic-node-js-first')).toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-second')).not.toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-third')).not.toBeInTheDocument();
    });

    // clean up for next tests
    fireEvent.change(filter, {
      target: { value: '' },
    });
    r.rerender(<PipelineRunsListView applicationName={appName} />);
    expect(filter.value).toBe('');
  });

  it('should render filtered pipelinerun list by status', async () => {
    usePipelineRunsMock.mockReturnValue([pipelineRuns, true]);
    const r = render(<PipelineRunsListView applicationName={appName} />);

    const statusFilter = screen.getByRole('button', {
      name: /status filter menu/i,
    });
    await fireEvent.click(statusFilter);
    expect(statusFilter).toHaveAttribute('aria-expanded', 'true');

    const succeededOption = screen.getByLabelText(/succeeded/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(succeededOption);

    r.rerender(<PipelineRunsListView applicationName={appName} />);
    expect(succeededOption.checked).toBe(true);
    await waitFor(() => {
      expect(screen.queryByText('basic-node-js-first')).toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-second')).not.toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-third')).not.toBeInTheDocument();
    });

    // clean up for other tests
    expect(statusFilter).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(succeededOption);
    r.rerender(<PipelineRunsListView applicationName={appName} />);
    expect(succeededOption.checked).toBe(false);
  });

  it('should render filtered pipelinerun list by type', async () => {
    usePipelineRunsMock.mockReturnValue([pipelineRuns, true]);
    const r = render(<PipelineRunsListView applicationName={appName} />);

    const typeFilter = screen.getByRole('button', {
      name: /type filter menu/i,
    });
    await fireEvent.click(typeFilter);
    expect(typeFilter).toHaveAttribute('aria-expanded', 'true');

    const testOption = screen.getByLabelText(/test/i, {
      selector: 'input',
    }) as HTMLInputElement;
    fireEvent.click(testOption);
    r.rerender(<PipelineRunsListView applicationName={appName} />);
    expect(testOption.checked).toBe(true);

    r.rerender(<PipelineRunsListView applicationName={appName} />);
    await waitFor(() => {
      expect(screen.queryByText('basic-node-js-first')).toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-second')).not.toBeInTheDocument();
      expect(screen.queryByText('basic-node-js-third')).not.toBeInTheDocument();
    });

    // clean up for other tests
    expect(typeFilter).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(testOption);
    r.rerender(<PipelineRunsListView applicationName={appName} />);
    expect(testOption.checked).toBe(false);
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
