import * as React from 'react';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import '@testing-library/jest-dom';
import { render, screen, configure, fireEvent, waitFor } from '@testing-library/react';
import { mockPipelineRuns } from '../../../../components/Components/__data__/mock-pipeline-run';
import { PipelineRunLabel, PipelineRunType } from '../../../../consts/pipelinerun';
import { useComponents } from '../../../../hooks/useComponents';
import { usePLRVulnerabilities } from '../../../../hooks/useScanResults';
import { useSearchParam } from '../../../../hooks/useSearchParam';
import { mockComponentsData } from '../../../ApplicationDetails/__data__';
import { PipelineRunListRow } from '../../../PipelineRunListView/PipelineRunListRow';
import SnapshotPipelineRunsList from '../SnapshotPipelineRunsList';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../../hooks/useScanResults', () => ({
  usePLRVulnerabilities: jest.fn(() => ({ vulnerabilities: {}, fetchedPipelineRuns: [] })),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../../hooks/useSearchParam', () => ({
  useSearchParam: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

jest.mock('../../../../shared/components/table', () => {
  const actual = jest.requireActual('../../../../shared/components/table');
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

jest.mock('../../../../utils/rbac', () => ({
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

configure({ testIdAttribute: 'data-test' });

const snapShotPLRs = [
  {
    apiVersion: mockPipelineRuns[0].apiVersion,
    kind: mockPipelineRuns[0].kind,
    metadata: {
      ...mockPipelineRuns[0].metadata,
      labels: {
        [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.BUILD,
      },
      annotations: {
        [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
      },
    },
    spec: null,
    status: null,
  },
  {
    apiVersion: mockPipelineRuns[0].apiVersion,
    kind: mockPipelineRuns[0].kind,
    metadata: {
      ...mockPipelineRuns[1].metadata,
      labels: {
        [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.TEST,
      },
      annotations: {
        [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
      },
    },
    spec: null,
    status: null,
  },
  {
    apiVersion: mockPipelineRuns[0].apiVersion,
    kind: mockPipelineRuns[0].kind,
    metadata: {
      ...mockPipelineRuns[2].metadata,
      labels: {
        ...mockPipelineRuns[2].metadata.labels,
        [PipelineRunLabel.PIPELINE_TYPE]: PipelineRunType.TEST,
      },
      annotations: {
        ...mockPipelineRuns[2].metadata.annotations,
        [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
      },
    },
    spec: null,
    status: null,
  },
];

describe('SnapshotPipelinerunsTab', () => {
  beforeEach(() => {
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    useComponentsMock.mockReturnValue([mockComponentsData, true]);
  });

  it('should render spinner if pipeline data is not loaded', () => {
    render(
      <SnapshotPipelineRunsList
        applicationName={appName}
        getNextPage={null}
        snapshotPipelineRuns={[]}
        loaded={false}
      />,
    );
    screen.getByRole('progressbar');
  });

  it('should render empty state if no pipelinerun is present', () => {
    render(
      <SnapshotPipelineRunsList
        applicationName={appName}
        getNextPage={null}
        snapshotPipelineRuns={[]}
        loaded={true}
      />,
    );
    screen.queryAllByText(/Not found/);
    const button = screen.queryByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toContain(
      `http://localhost/application-pipeline/workspaces/test-ws/import?application=my-test-app`,
    );
  });

  it('should render entire pipelineRuns list when no filter value', () => {
    render(
      <SnapshotPipelineRunsList
        applicationName={appName}
        getNextPage={null}
        snapshotPipelineRuns={snapShotPLRs}
        loaded={true}
      />,
    );
    expect(screen.queryByText('python-sample-942fq')).toBeInTheDocument();
    expect(screen.queryByText('go-sample-s2f4f')).toBeInTheDocument();
    expect(screen.queryByText('go-sample-vvs')).toBeInTheDocument();
    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    expect(filter.value).toBe('');
  });

  it('should render filtered pipelinerun list and should call nextPage', async () => {
    const r = render(
      <SnapshotPipelineRunsList
        applicationName={appName}
        getNextPage={null}
        snapshotPipelineRuns={snapShotPLRs}
        loaded={true}
      />,
    );
    expect(screen.queryByText('python-sample-942fq')).toBeInTheDocument();
    expect(screen.queryByText('go-sample-s2f4f')).toBeInTheDocument();
    expect(screen.queryByText('go-sample-vvs')).toBeInTheDocument();

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');
    fireEvent.change(filter, {
      target: { value: 'go-sample-s2f4f' },
    });

    usePLRVulnerabilitiesMock.mockReturnValue({
      vulnerabilities: {},
      fetchedPipelineRuns: snapShotPLRs.map((plr) => plr.metadata.name),
    });
    expect(filter.value).toBe('go-sample-s2f4f');

    r.rerender(
      <SnapshotPipelineRunsList
        applicationName={appName}
        getNextPage={null}
        snapshotPipelineRuns={snapShotPLRs}
        loaded={true}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByText('python-sample-942fq')).not.toBeInTheDocument();
      expect(screen.queryByText('go-sample-s2f4f')).toBeInTheDocument();
      expect(screen.queryByText('go-sample-vvs')).not.toBeInTheDocument();
    });
  });

  it('should clear the filters and render the list again in the table', async () => {
    const r = render(
      <SnapshotPipelineRunsList
        applicationName={appName}
        getNextPage={null}
        snapshotPipelineRuns={snapShotPLRs}
        loaded={true}
      />,
    );

    const filter = screen.getByPlaceholderText<HTMLInputElement>('Filter by name...');

    fireEvent.change(filter, {
      target: { value: 'no-match' },
    });

    expect(filter.value).toBe('no-match');

    r.rerender(
      <SnapshotPipelineRunsList
        applicationName={appName}
        getNextPage={null}
        snapshotPipelineRuns={snapShotPLRs}
        loaded={true}
      />,
    );
    await waitFor(() => {
      expect(screen.queryByText('python-sample-942fq')).not.toBeInTheDocument();
      expect(screen.queryByText('go-sample-s2f4f')).not.toBeInTheDocument();
      expect(screen.queryByText('go-sample-vvs')).not.toBeInTheDocument();
      expect(screen.queryByText('No results found')).toBeInTheDocument();
      expect(
        screen.queryByText(
          'No results match this filter criteria. Clear all filters and try again.',
        ),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.queryByRole('button', { name: 'Clear all filters' }));
    await waitFor(() => {
      expect(screen.queryByText('python-sample-942fq')).toBeInTheDocument();
      expect(screen.queryByText('go-sample-s2f4f')).toBeInTheDocument();
      expect(screen.queryByText('go-sample-vvs')).toBeInTheDocument();
    });
  });
});
