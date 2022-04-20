import * as React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formikRenderer } from '../../../utils/test-utils';
import { SourceSection } from '../SourceSection';
import '@testing-library/jest-dom';
import { useComponentDetection } from '../utils';

jest.mock('../utils', () => ({
  useComponentDetection: jest.fn(),
  useAccessTokenBindingAuth: jest.fn(),
}));

jest.mock('../../../shared/hooks', () => ({
  useFormikValidationFix: jest.fn(),
}));

const useComponentDetectionMock = useComponentDetection as jest.Mock;

const renderSourceSection = () => {
  const onClick = jest.fn();

  const utils = formikRenderer(<SourceSection onSamplesClick={onClick} />, { source: '' });
  const user = userEvent.setup();

  return { input: utils.getByPlaceholderText('Enter your source'), ...utils, onClick, user };
};

afterEach(jest.resetAllMocks);

describe('SourceField', () => {
  it('renders input field and sample button', () => {
    useComponentDetectionMock.mockReturnValue([null, null]);
    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeInTheDocument();
    expect(screen.getByText('Start with a sample.')).toBeInTheDocument();
  });

  it('fires callback on sample button click', () => {
    useComponentDetectionMock.mockReturnValue([null, null]);

    const { onClick } = renderSourceSection();

    fireEvent.click(screen.getByText('Start with a sample.'));
    expect(onClick).toHaveBeenCalled();
  });

  it('displays error when components cannot be detected', async () => {
    useComponentDetectionMock.mockReturnValue([null, 'Error']);

    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeInvalid();
    expect(screen.getByText('Unable to detect components')).toBeVisible();
  });

  it('validates input field when components are detected', async () => {
    useComponentDetectionMock.mockReturnValue([
      { comp: { componentStub: { componentName: 'test' } } },
      null,
    ]);

    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeValid();
    expect(screen.getByText('Validated')).toBeVisible();
  });

  it('should show Authorization if input is container image', async () => {
    useComponentDetectionMock.mockReturnValue([null, null]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'quay.io/example/repo');

    await waitFor(() => expect(screen.getByText('Authorization')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Git options')).toBeNull());
  });

  it('should not show Authorization or Git options if input is invalid', async () => {
    useComponentDetectionMock.mockReturnValue([null, null]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'docker.io/example');

    await waitFor(() => expect(screen.queryByText('Authorization')).toBeNull());
    await waitFor(() => expect(screen.queryByText('Git options')).toBeNull());
  });

  it('should show git options for a valid git url and components are detected', async () => {
    useComponentDetectionMock.mockReturnValue([
      { comp: { componentStub: { componentName: 'test' } } },
      null,
    ]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'https://github.com/example/repo');

    await waitFor(() => expect(screen.queryByText('Git options')).toBeInTheDocument());

    await user.type(input, 'dummy text');

    await waitFor(() => expect(screen.queryByText('Git options')).toBeNull());
  });
});
