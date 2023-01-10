import * as React from 'react';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@openshift/dynamic-plugin-sdk';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, configure, fireEvent, act, waitFor } from '@testing-library/react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useGitOpsDeploymentCR } from '../../../hooks/useGitOpsDeploymentCR';
import { mockApplication } from '../../ApplicationDetailsView/__data__/mock-data';
import ApplicationDetails from '../ApplicationDetails';
import { HACBS_APPLICATION_MODAL_HIDE_KEY } from '../ApplicationModal';

jest.mock('react-router-dom', () => ({
  Link: (props) => (
    <a href={props.to} data-test={props.to}>
      {props.children}
    </a>
  ),
  useNavigate: () => jest.fn(),
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: jest.fn(),
}));
jest.mock('../../../hooks/useGitOpsDeploymentCR', () => ({
  useGitOpsDeploymentCR: jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => ({
  useFeatureFlag: jest.fn(),
}));

const useChromeMock = useChrome as jest.Mock;
const useFeatureFlagMock = useFeatureFlag as jest.Mock;

configure({ testIdAttribute: 'data-test' });

const watchResourceMock = useK8sWatchResource as jest.Mock;
const mockGitOpsDiploymentCR = useGitOpsDeploymentCR as jest.Mock;

describe('ApplicationDetails', () => {
  beforeEach(() => {
    localStorage.removeItem(HACBS_APPLICATION_MODAL_HIDE_KEY);
    useFeatureFlagMock.mockReturnValue([false]);
    mockGitOpsDiploymentCR.mockReturnValue([[], false]);
  });
  it('should render spinner if application data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    const set = jest.fn();
    const toggle = jest.fn();
    useChromeMock.mockReturnValue({
      quickStarts: { set, toggle },
    });
    render(<ApplicationDetails applicationName="test" />);
    expect(screen.queryByTestId('spinner')).toBeInTheDocument();
  });

  it('should render application display name if application data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]);
    const set = jest.fn();
    const toggle = jest.fn();
    useChromeMock.mockReturnValue({
      quickStarts: { set, toggle },
    });
    render(<ApplicationDetails applicationName="test" />);
    expect(screen.queryByTestId('details__title')).toBeInTheDocument();
    expect(screen.queryByTestId('details__title').innerHTML).toBe('Test Application');
  });

  it('should display overview modal on first run', async () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]);
    render(<ApplicationDetails applicationName="test" />);
    expect(screen.getByTestId('application-modal-content')).toBeVisible();

    act(() => {
      const dismissButton = screen.getByTestId('application-modal-dismiss-btn');
      fireEvent.click(dismissButton);
    });

    waitFor(() => {
      expect(localStorage[HACBS_APPLICATION_MODAL_HIDE_KEY]).toBe('true');
      expect(screen.getByTestId('application-modal-content')).not.toBeVisible();
    });
  });

  it('should not display integration test tab if the mvp flag is set to true', async () => {
    useFeatureFlagMock.mockReturnValue([true]);
    watchResourceMock.mockReturnValueOnce([mockApplication, true]);
    render(<ApplicationDetails applicationName="test" />);
    expect(screen.queryByTestId('details__tabItem integrationtests')).not.toBeInTheDocument();
  });
});
