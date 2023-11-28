import * as React from 'react';
import { Table as PfTable, TableHeader } from '@patternfly/react-table/deprecated';
import '@testing-library/jest-dom';
import { render, screen, configure } from '@testing-library/react';
import { mockPipelineRuns } from '../../../../components/Components/__data__/mock-pipeline-run';
import { PipelineRunLabel } from '../../../../consts/pipelinerun';
import { useComponents } from '../../../../hooks/useComponents';
import { usePipelineRuns } from '../../../../hooks/usePipelineRuns';
import { useSearchParam } from '../../../../hooks/useSearchParam';
import { mockComponentsData } from '../../../ApplicationDetails/__data__';
import { PipelineRunListRow } from '../../../PipelineRunListView/PipelineRunListRow';
import SnapshotPipelineRunsTab from '../SnapshotPipelineRunsTab';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../../hooks/usePipelineRuns', () => ({
  usePipelineRuns: jest.fn(),
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
const usePipelineRunsMock = usePipelineRuns as jest.Mock;

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
    ...mockPipelineRuns[0],
    metadata: {
      ...mockPipelineRuns[0].metadata,
      labels: {
        ...mockPipelineRuns[0].metadata.labels,
        [PipelineRunLabel.PIPELINE_TYPE]: 'test',
      },
      annotations: {
        ...mockPipelineRuns[2].metadata.annotations,
        [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
      },
    },
  },
  {
    ...mockPipelineRuns[1],
    metadata: {
      ...mockPipelineRuns[1].metadata,
      labels: {
        ...mockPipelineRuns[1].metadata.labels,
        [PipelineRunLabel.PIPELINE_TYPE]: 'build',
      },
      annotations: {
        ...mockPipelineRuns[2].metadata.annotations,
        [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
      },
    },
  },
  {
    ...mockPipelineRuns[2],
    metadata: {
      ...mockPipelineRuns[2].metadata,
      labels: {
        ...mockPipelineRuns[2].metadata.labels,
        [PipelineRunLabel.PIPELINE_TYPE]: 'test',
      },
      annotations: {
        ...mockPipelineRuns[2].metadata.annotations,
        [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
      },
    },
  },
];

describe('SnapshotPipelinerunsTab', () => {
  beforeEach(() => {
    useSearchParamMock.mockImplementation(mockUseSearchParam);
    useComponentsMock.mockReturnValue([mockComponentsData, true]);
  });

  it('should render spinner if pipeline data is not loaded', () => {
    usePipelineRunsMock.mockReturnValue([[], false]);
    render(
      <SnapshotPipelineRunsTab
        applicationName={appName}
        namespace="test"
        snapshotName="test-snapshot"
      />,
    );
    screen.getByRole('progressbar');
  });

  it('should render empty state if no pipelinerun is present', () => {
    usePipelineRunsMock.mockReturnValue([[], true, false]);
    render(
      <SnapshotPipelineRunsTab
        applicationName={appName}
        namespace="test"
        snapshotName="test-snapshot"
      />,
    );
    screen.queryByText(/Not found/);
    const button = screen.queryByText('Add component');
    expect(button).toBeInTheDocument();
    expect(button.closest('a').href).toContain(
      `http://localhost/application-pipeline/workspaces/test-ws/import?application=my-test-app`,
    );
  });

  it('should render pipelineRuns list when pipelineRuns are present', () => {
    usePipelineRunsMock.mockReturnValue([[snapShotPLRs], true, false]);
    render(
      <SnapshotPipelineRunsTab
        applicationName={appName}
        namespace="test"
        snapshotName="test-snapshot"
      />,
    );
    screen.queryByText(/Pipeline runs/);
    screen.queryByText('Name');
    screen.queryByText('Started');
    screen.queryByText('Duration');
    screen.queryAllByText('Status');
    screen.queryAllByText('Type');
    screen.queryByText('Component');
  });

  it('should render both Build and Test pipelineruns in the pipelinerun list', () => {
    usePipelineRunsMock.mockReturnValue([[snapShotPLRs], true, false]);
    render(
      <SnapshotPipelineRunsTab
        applicationName={appName}
        namespace="test"
        snapshotName="test-snapshot"
      />,
    );

    screen.queryByText('Build');
    screen.queryByText('Test');
    screen.queryByText('python-sample-942fq');
    screen.queryByText('go-sample-s2f4f');
  });

  it('should render pipelineruns with Snapshot label instead of annotation as well', () => {
    usePipelineRunsMock.mockReturnValue([
      [
        {
          ...mockPipelineRuns[0],
          metadata: {
            ...mockPipelineRuns[0].metadata,
            labels: {
              ...mockPipelineRuns[0].metadata.labels,
              [PipelineRunLabel.PIPELINE_TYPE]: 'test',
              [PipelineRunLabel.SNAPSHOT]: 'test-snapshot',
            },
            annotations: {
              ...mockPipelineRuns[2].metadata.annotations,
            },
          },
        },
      ],
      true,
      false,
    ]);
    render(
      <SnapshotPipelineRunsTab
        applicationName={appName}
        namespace="test"
        snapshotName="test-snapshot"
      />,
    );

    screen.queryByText('Test');
    screen.queryByText('go-sample-s2f4f');
  });
});
