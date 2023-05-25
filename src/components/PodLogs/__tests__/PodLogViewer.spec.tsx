import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import { mockPods } from '../__data__/pod-mock-data';
import { PodLogViewer } from '../PodLogViewer';

configure({ testIdAttribute: 'data-test' });

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../shared/components/pipeline-run-logs/logs/Logs', () => () => (
  <div data-test="pod-logs" />
));

describe('PodLogViewer', () => {
  it('should show error box with message', () => {
    render(<PodLogViewer pod={null} />);
    screen.findByText('pod not found');
  });

  it('should show required pod metadata and logs', () => {
    render(<PodLogViewer pod={mockPods[0]} />);
    expect(screen.findByText('pod-logs')).not.toBeNull();
    screen.findByText('Pod status:');
    screen.findByText('Number of restarts:');
    screen.findByText('Age:');
    screen.findByText('149 hours 43 minutes 21 seconds');
  });

  it('should show correct navList', () => {
    render(<PodLogViewer pod={mockPods[0]} />);

    screen.getByTestId('pod-log-navlist');
    screen.findByText('my-nodejs');
    screen.findByText('my-nodejs-2');
  });
});
