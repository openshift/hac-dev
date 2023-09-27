import * as React from 'react';
import { fireEvent, render, screen, configure } from '@testing-library/react';
import { useModalLauncher } from '../../../modal/ModalProvider';
import {
  MockIntegrationTestsWithBundles,
  MockIntegrationTestsWithGit,
  MockIntegrationTestsWithParams,
} from '../../IntegrationTestsListView/__data__/mock-integration-tests';
import IntegrationTestOverviewTab from '../IntegrationTestOverviewTab';

jest.mock('../../../modal/ModalProvider', () => ({
  useModalLauncher: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
}));

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

configure({ testIdAttribute: 'data-test' });

describe('IntegrationTestOverviewTab', () => {
  it('should render correct details', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTestsWithGit[0]} />);
    screen.getByText('test-app-test-1'); // name
    screen.getByText('test-namespace'); // namespace
    screen.getByText('main'); // revision
    screen.getByText('Optional'); // optional for release
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe('https://test-url'); // git url
  });

  it('should render correct param fields', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTestsWithGit[0]} />);
    screen.getByText('test-app-test-1'); // name
    screen.getByText('test-namespace'); // namespace
    screen.getByText('GitHub URL'); // url
    screen.getByText('Path in repository'); // Path in Repo
    screen.getByText('Revision'); // revision
    screen.getByText('Optional'); // optional for release
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe('https://test-url'); // git url
  });

  it('should render correct param values', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTestsWithGit[1]} />);
    screen.getByText('test-app-test-2'); // name
    screen.getByText('test-namespace'); // namespace
    screen.getByText('test-url2'); // url
    screen.getByText('main2'); // revision
    screen.getByText('test-path2'); // path
    screen.getByText('Mandatory'); // optional for release
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe('https://test-url2'); // git url
    expect(screen.getAllByRole('link')[1].getAttribute('href')).toBe(
      'https://test-url2/tree/main2',
    ); // revision
    expect(screen.getAllByRole('link')[2].getAttribute('href')).toBe(
      'https://test-url2/tree/main2/test-path2',
    ); // path link
  });

  it('should use the git url from the spec param', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTestsWithGit[0]} />);
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe('https://test-url');
  });

  it('should append https to the git url if it is not present in the spec', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTestsWithGit[1]} />);
    expect(screen.getAllByRole('link')[0].getAttribute('href')).toBe('https://test-url2');
  });

  it('should render correct param values for bundle resolvers', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTestsWithBundles[0]} />);
    screen.getByText('test-app-test-1'); // name
    screen.getByText('test-namespace'); // namespace
    screen.getByText('Optional'); // optional for release
    screen.getByText('Bundle');
  });

  it('should display multiple parameters', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTestsWithParams[0]} />);
    screen.getByText('example-git'); // name
    screen.getByText('3 parameters'); // Params
  });

  it('should not pluralize when only one param', () => {
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTestsWithParams[2]} />);
    screen.getByText('test-app-test-3'); // name
    screen.getByText('1 parameter'); // Params
  });

  it('should show Modal when edit param is clicked', () => {
    const showModal = jest.fn();
    (useModalLauncher as jest.Mock).mockImplementation(() => {
      return showModal;
    });
    render(<IntegrationTestOverviewTab integrationTest={MockIntegrationTestsWithParams[0]} />);
    const editParambtn = screen.getByTestId('edit-param-button'); // Params
    fireEvent.click(editParambtn);
    expect(showModal).toHaveBeenCalled();
  });
});
