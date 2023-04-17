import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render, screen, waitFor } from '@testing-library/react';
import { componentCRMocks } from '../../Components/__data__/mock-data';
import { mockPods } from '../__data__/pod-mock-data';
import PodLogsColumn from '../PodLogsColumn';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

describe('PodLogsColumn', () => {
  it('should render View pod logs action item when Pod loads', async () => {
    useK8sWatchResourceMock.mockReturnValue([[mockPods[0]], true]);
    render(
      <BrowserRouter>
        <PodLogsColumn component={componentCRMocks[0]} podSelector="test" />
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByText('View pod logs'));
  });
});
