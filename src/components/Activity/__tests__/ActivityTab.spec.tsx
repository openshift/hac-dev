import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import { routerRenderer } from '../../../utils/test-utils';
import { ActivityTab } from '../ActivityTab';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: () => [[], false],
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

const useNavigateMock = useNavigate as jest.Mock;

describe('Activity Tab', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Activity Tab', () => {
    routerRenderer(<ActivityTab applicationName="abcd" />);
    screen.getByText('Activity By');
  });

  it('should render two tabs under activity', async () => {
    routerRenderer(<ActivityTab applicationName="abcd" />);
    screen.getByText('Latest commits');
    screen.getByText('Pipeline runs');

    const plrTab = screen.getByTestId('activity__tabItem pipelineruns');

    await act(async () => {
      fireEvent.click(plrTab);
    });
    expect(navigateMock).toHaveBeenCalledWith(
      '/stonesoup/applications/abcd/undefined/pipelineruns',
    );
  });
});
