import * as React from 'react';
import '@testing-library/jest-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, fireEvent, act, configure } from '@testing-library/react';
import { useComponents } from '../../../../hooks/useComponents';
import { routerRenderer } from '../../../../utils/test-utils';
import { pipelineWithCommits } from '../../../Commits/__data__/pipeline-with-commits';
import { MockComponents } from '../../../Commits/CommitDetails/visualization/__data__/MockCommitWorkflowData';
import { ComponentActivityTab } from '../tabs/ComponentActivityTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('../../../../hooks/useTektonResults');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual<any>('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

jest.mock('../../../Commits/commit-status', () => ({
  useCommitStatus: () => ['-', true],
}));

jest.mock('../../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;
const useComponentsMock = useComponents as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;
const useParamsMock = useParams as jest.Mock;

configure({ testIdAttribute: 'data-testid' });

describe('ComponentDetailsView', () => {
  let navigateMock: jest.Mock;

  beforeEach(() => {
    watchResourceMock.mockReturnValue([pipelineWithCommits.slice(0, 4), true]);
    useComponentsMock.mockReturnValue([MockComponents, true]);

    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    useParamsMock.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component activity', () => {
    routerRenderer(<ComponentActivityTab component={MockComponents[0]} />);
    screen.getByTestId('comp__activity__tabItem commits');
    screen.getByTestId('comp__activity__tabItem pipelineruns');
  });

  it('should render two tabs under component activity', async () => {
    routerRenderer(<ComponentActivityTab component={MockComponents[0]} />);
    screen.getByTestId('comp__activity__tabItem commits');
    const plrTab = screen.getByTestId('comp__activity__tabItem pipelineruns');

    await act(async () => {
      fireEvent.click(plrTab);
    });
    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws/applications/my-test-output/components/stock-app-webshop-jhnj/undefined/pipelineruns',
    );
  });
});
