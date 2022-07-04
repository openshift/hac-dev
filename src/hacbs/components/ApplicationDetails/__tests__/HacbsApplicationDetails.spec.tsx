import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, configure } from '@testing-library/react';
import { mockApplication } from '../../../../components/ApplicationDetailsView/__data__/mock-data';
import HacbApplicationDetails from '../HacbsApplicationDetails';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => jest.fn(),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('HacbApplicationDetails', () => {
  it('should render spinner if application data is not loaded', () => {
    watchResourceMock.mockReturnValue([[], false]);
    render(<HacbApplicationDetails applicationName="test" />);
    expect(screen.queryByTestId('spinner')).toBeInTheDocument();
  });

  it('should render application display name if application data is loaded', () => {
    watchResourceMock.mockReturnValueOnce([mockApplication, true]);
    render(<HacbApplicationDetails applicationName="test" />);
    expect(screen.queryByTestId('details__title')).toBeInTheDocument();
    expect(screen.queryByTestId('details__title').innerHTML).toBe('Test Application');
  });
});
