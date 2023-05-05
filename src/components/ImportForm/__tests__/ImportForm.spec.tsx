import React from 'react';
import { render, screen, configure, waitFor } from '@testing-library/react';
import { useApplicationBreadcrumbs } from '../../../utils/breadcrumb-utils';
import ImportForm from '../ImportForm';
import { useValidApplicationName } from '../utils/useValidApplicationName';
import '@testing-library/jest-dom';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn(), disableTopics: jest.fn() },
  }),
}));

jest.mock('../utils/useValidApplicationName', () => ({
  useValidApplicationName: jest.fn(),
}));

jest.mock('../../../utils/breadcrumb-utils', () => ({
  useApplicationBreadcrumbs: jest.fn(),
}));

jest.mock('../GitImportForm', () => (props) => {
  return (
    <div data-test="git-import-form">
      <button onClick={() => props.setReviewMode(true)} data-test="submit-button">
        Submit
      </button>
    </div>
  );
});

jest.mock('../SampleImportForm', () => () => {
  return <div data-test="sample-import-form" />;
});

const useValidApplicationNameMock = useValidApplicationName as jest.Mock;
const useApplicationBreadcrumbsMock = useApplicationBreadcrumbs as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('ImportForm', () => {
  beforeEach(() => {
    useApplicationBreadcrumbsMock.mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when app name recommendation is not loaded', () => {
    useValidApplicationNameMock.mockReturnValue(['', false]);
    render(<ImportForm />);
    screen.getByRole('progressbar');
  });

  it('should render correct title and description for source section', () => {
    useValidApplicationNameMock.mockReturnValue(['my-app-1', true]);
    render(<ImportForm applicationName="my-app" />);
    screen.getByText('Grab some code');
    screen.getByText('Provide a link to your GitHub repository or start with a no-fail sample.');
  });

  it('should change the title and description for review mode', async () => {
    useValidApplicationNameMock.mockReturnValue(['my-app-1', true]);
    render(<ImportForm applicationName="my-app" />);
    screen.getByText('Grab some code');
    screen.getByText('Provide a link to your GitHub repository or start with a no-fail sample.');

    await waitFor(() => screen.getByTestId('submit-button').click());

    screen.getByText('Configure your components for deployment');
    screen.getByText('Review and define deployment settings and options.');
  });

  it('should render the git and sample import forms', () => {
    useValidApplicationNameMock.mockReturnValue(['my-app-1', true]);
    render(<ImportForm applicationName="my-app" />);
    screen.getByTestId('git-import-form');
    screen.getByTestId('sample-import-form');
  });

  it('should render only git import form if user goes from source to review step', async () => {
    useValidApplicationNameMock.mockReturnValue(['my-app-1', true]);
    render(<ImportForm />);

    screen.getByTestId('git-import-form');
    screen.getByTestId('sample-import-form');

    const submitButton = screen.getByTestId('submit-button');

    await waitFor(() => submitButton.click());
    screen.getByTestId('git-import-form');
    expect(screen.queryByTestId('sample-import-form')).not.toBeInTheDocument();
  });
});
