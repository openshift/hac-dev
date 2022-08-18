import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, configure } from '@testing-library/react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { mockApplication } from '../../../../components/ApplicationDetailsView/__data__/mock-data';
import { applicationQuickstartContent } from '../ApplicationQuickstartContent';
import HacbsApplicationDetails from '../HacbsApplicationDetails';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => jest.fn(),
  useSearchParams: () => React.useState(() => new URLSearchParams()),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: jest.fn(),
}));

const useChromeMock = useChrome as jest.Mock;

configure({ testIdAttribute: 'data-test' });

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('HacbsApplicationDetails', () => {
  it('should render spinner if application data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    const set = jest.fn();
    const toggle = jest.fn();
    useChromeMock.mockReturnValue({
      quickStarts: { set, toggle },
    });
    render(<HacbsApplicationDetails applicationName="test" />);
    expect(screen.queryByTestId('spinner')).toBeInTheDocument();
  });

  it('should render application display name if application data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]);
    const set = jest.fn();
    const toggle = jest.fn();
    useChromeMock.mockReturnValue({
      quickStarts: { set, toggle },
    });
    render(<HacbsApplicationDetails applicationName="test" />);
    expect(screen.queryByTestId('details__title')).toBeInTheDocument();
    expect(screen.queryByTestId('details__title').innerHTML).toBe('Test Application');
  });

  it('should only display quick start on first run', () => {
    const gsApp = 'hacbs-getting-started-app';
    const chromeStore = 'hac-dev';

    localStorage.removeItem('hacbs/showApplicationQuickstart');
    let showQuickStart = localStorage.getItem('hacbs/showApplicationQuickstart');
    expect(showQuickStart).toBeNull();
    watchResourceMock.mockReturnValueOnce([mockApplication, true]);
    const set = jest.fn();
    const toggle = jest.fn();
    useChromeMock.mockReturnValue({
      quickStarts: { set, toggle },
    });

    render(<HacbsApplicationDetails applicationName="test" />);
    showQuickStart = localStorage.getItem('hacbs/showApplicationQuickstart');
    // localStorage key doesn't exist, quickstart set/toggle should be called
    expect(showQuickStart).toEqual('false');
    expect(set).toHaveBeenCalledWith(chromeStore, [applicationQuickstartContent]);
    expect(toggle).toHaveBeenCalledWith(gsApp);
    set.mockClear();
    toggle.mockClear();

    render(<HacbsApplicationDetails applicationName="test" />);
    // localStorage key exists, quickstart set/toggle should not be called
    expect(set).not.toHaveBeenCalled();
    expect(toggle).not.toHaveBeenCalled();
    set.mockClear();
    toggle.mockClear();

    localStorage.removeItem('hacbs/showApplicationQuickstart');
    render(<HacbsApplicationDetails applicationName="test" />);
    // localStorage key removed, quickstart set/toggle should be called
    expect(set).toHaveBeenCalledWith(chromeStore, [applicationQuickstartContent]);
    expect(toggle).toHaveBeenCalledWith(gsApp);
  });
});
