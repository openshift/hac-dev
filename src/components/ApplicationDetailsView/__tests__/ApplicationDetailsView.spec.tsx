import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { mockApplication } from '../__data__/mock-data';
import { mockPipelineRuns } from '../__data__/mock-pipeline-run';
import ApplicationDetailsView from '../ApplicationDetailsView';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('../../../hooks/useQuickstartCloseOnUnmount', () => ({
  useQuickstartCloseOnUnmount: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn(), disableTopics: jest.fn() },
  }),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => {},
}));

jest.mock('../../modal/ModalProvider', () => ({
  useModalLauncher: () => {},
}));

jest.mock('../../../hooks/usePipelineRunsForApplication', () => ({
  useLatestPipelineRunsForApplication: () => [mockPipelineRuns, true, undefined],
  useLatestPipelineRunForComponent: () => mockPipelineRuns[0],
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('ApplicationDetailsView', () => {
  it('should render spinner if application data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<ApplicationDetailsView applicationName="test" />);
    screen.getByRole('progressbar');
  });

  it('should render application display name if application data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]).mockReturnValue([[], true]);
    render(<ApplicationDetailsView applicationName="test-application" />);
    screen.getAllByText('Test Application');
  });

  it('should render spinner if components data is not loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]).mockReturnValue([[], true]);
    render(<ApplicationDetailsView applicationName="test-application" />);
    const button = screen.getByText('Collapse');
    expect(screen.queryByText('Build Succeeded')).toBeInTheDocument();
    expect(screen.queryByText('Last Build')).toBeInTheDocument();
    fireEvent.click(button);
    screen.getByText('Expand');
    expect(screen.queryByText('Succeeded')).toBeInTheDocument();
    expect(screen.queryByText('Last Build')).not.toBeInTheDocument();
  });

  it('should show error state if application cannot be loaded', () => {
    watchResourceMock.mockReturnValue([[], false, { message: 'Application does not exist' }]);
    render(<ApplicationDetailsView applicationName="test" />);
    screen.getByText('Application does not exist');
  });
});
