import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MockIntegrationTests } from '../../IntegrationTestsListView/__data__/mock-integration-tests';
import IntegrationTestOverviewTab from '../IntegrationTestOverviewTab';

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

describe('IntegrationTestOverviewTab', () => {
  it('should render correct details', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTests[0]} />);
    screen.getByText('test-app-test-1'); // name
    screen.getByText('test-namespace'); // namespace
    screen.getByText('pipeline-1'); // pipeline-to-run
    screen.getByText('Optional'); // optional for release
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe(
      'quay.io/test-rep/test-bundle:test-1',
    ); // image bundle
    expect(screen.getAllByRole('link')[1].getAttribute('href')).toBe(
      '/stonesoup/applications/test-app',
    ); // application link
  });

  it('should render correct details', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTests[1]} />);
    screen.getByText('test-app-test-2'); // name
    screen.getByText('test-namespace'); // namespace
    screen.getByText('pipeline-2'); // pipeline-to-run
    screen.getByText('Mandatory'); // optional for release
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe(
      'quay.io/test-rep/test-bundle:test-2',
    ); // image bundle
    expect(screen.getAllByRole('link')[1].getAttribute('href')).toBe(
      '/stonesoup/applications/test-app',
    ); // application link
  });
});
