import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DataState, testPipelineRuns } from '../../../__data__/pipelinerun-data';
import { PipelineRunListRowWithVulnerabilities } from '../PipelineRunListRow';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
    Link: (props) => <a href={props.to}>{props.children}</a>,
    useSearchParams: jest.fn(),
  };
});

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: () => [[{ metadata: { name: 'test-ns' } }], false],
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

describe('Pipeline run Row', () => {
  it('should return - when pipelinerun is in running state ', () => {
    const runningPipelineRun = testPipelineRuns[DataState.RUNNING];
    const row = render(
      <PipelineRunListRowWithVulnerabilities obj={runningPipelineRun} columns={[]} />,
    );

    expect(row.getByText('-')).toBeDefined();
    expect(row.getByText('Running')).toBeDefined();
  });

  it('should return - when vulnerabilities is not available ', () => {
    const succeededPlr = testPipelineRuns[DataState.SUCCEEDED];
    const plrName = succeededPlr.metadata.name;
    const row = render(
      <PipelineRunListRowWithVulnerabilities
        obj={succeededPlr}
        customData={{
          fetchedPipelineRuns: [plrName],
          vulnerabilities: [{ [plrName]: {} }],
        }}
        columns={[]}
      />,
    );

    expect(row.getByText('-')).toBeDefined();
    expect(row.getByText('Succeeded')).toBeDefined();
  });

  it('should show vulnerabilities when it is available ', () => {
    const succeededPlr = testPipelineRuns[DataState.SUCCEEDED];
    const plrName = succeededPlr.metadata.name;
    const row = render(
      <PipelineRunListRowWithVulnerabilities
        obj={succeededPlr}
        customData={{
          fetchedPipelineRuns: [plrName],
          vulnerabilities: {
            [plrName]: [
              {
                vulnerabilities: {
                  critical: 5,
                  medium: 0,
                  high: 0,
                  low: 0,
                },
              },
            ],
          },
        }}
        columns={[]}
      />,
    );

    expect(row.getByText('Critical')).toBeDefined();
    expect(row.getByText('5')).toBeDefined();
    expect(row.getByText('Succeeded')).toBeDefined();
  });

  it('should display correct PLR actions', async () => {
    const succeededPlr = testPipelineRuns[DataState.SUCCEEDED];
    const plrName = succeededPlr.metadata.name;
    const row = render(
      <PipelineRunListRowWithVulnerabilities
        obj={succeededPlr}
        customData={{
          fetchedPipelineRuns: [plrName],
          vulnerabilities: [{ [plrName]: {} }],
        }}
        columns={[]}
      />,
    );

    fireEvent.click(row.getByTestId('kebab-button'));

    await waitFor(() => {
      row.getByText('Rerun');
      row.getByText('Stop');
      row.getByText('Cancel');
    });
  });
});
