import React from 'react';
import { useNavigate } from 'react-router-dom';
import { render, waitFor, screen, configure } from '@testing-library/react';
import { mockApplication, componentCRMocks } from '../../Components/__data__/mock-data';
import SampleImportForm from '../SampleImportForm';
import { createResources } from '../utils/submit-utils';
import { ImportStrategy } from '../utils/types';
import { useValidApplicationName } from '../utils/useValidApplicationName';

jest.mock('../../../utils/analytics');

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../utils/useValidApplicationName', () => ({
  useValidApplicationName: jest.fn(),
}));

jest.mock('../utils/submit-utils.ts', () => ({
  createResources: jest.fn(),
}));

jest.mock('../SampleSection/SampleSection', () => (props) => {
  return (
    <div data-test="sample-section">
      <button
        onClick={() => props.onSampleImport('https://github.com/test/test-repo', 'node')}
        data-test="import-sample-button"
      >
        Import sample
      </button>
    </div>
  );
});

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns', workspace: 'test-ws' })),
}));

configure({ testIdAttribute: 'data-test' });

const createResourcesMock = createResources as jest.Mock;
const useNavigateMock = useNavigate as jest.Mock;
const useValidApplicationNameMock = useValidApplicationName as jest.Mock;

describe('SampleImportForm', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigateMock.mockImplementation(() => navigateMock);
    useValidApplicationNameMock.mockReturnValue(['my-app', true]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the spinner when app name recommendation is not loaded', () => {
    useValidApplicationNameMock.mockReturnValue(['', false]);

    render(<SampleImportForm applicationName="" />);
    screen.getByRole('progressbar');
  });

  it('should render correct section, title and actions for sample form', () => {
    render(<SampleImportForm applicationName="" />);

    screen.getByTestId('sample-section');
    screen.getByText('Select a sample');

    screen.getByRole('button', { name: 'Import sample' });
  });

  it('should call create resources when import sample is clicked', async () => {
    createResourcesMock.mockResolvedValue({
      applicationName: 'my-app',
      application: mockApplication,
      components: componentCRMocks,
    });
    render(<SampleImportForm applicationName="" />);

    const importSampleButton = screen.getByTestId('import-sample-button');

    await waitFor(() => importSampleButton.click());

    expect(createResourcesMock).toHaveBeenCalledWith(
      {
        application: 'my-app',
        inAppContext: false,
        namespace: 'test-ns',
        source: {
          git: {
            url: 'https://github.com/test/test-repo',
          },
        },
      },
      ImportStrategy.SAMPLE,
    );

    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws/applications/my-app',
    );
  });

  it('should navigate when import sample is clicked', async () => {
    createResourcesMock.mockResolvedValue({
      applicationName: 'my-app',
      application: mockApplication,
      components: componentCRMocks,
    });
    render(<SampleImportForm applicationName="" />);

    const importSampleButton = screen.getByTestId('import-sample-button');

    await waitFor(() => importSampleButton.click());

    expect(navigateMock).toHaveBeenCalledWith(
      '/application-pipeline/workspaces/test-ws/applications/my-app',
    );
  });
});
