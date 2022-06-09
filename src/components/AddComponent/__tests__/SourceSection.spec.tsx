import * as React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServiceProviderType } from '../../../types';
import { formikRenderer } from '../../../utils/test-utils';
import { SourceSection } from '../SourceSection';
import '@testing-library/jest-dom';
import { useAccessCheck } from '../utils';

jest.mock('../utils', () => ({
  useAccessTokenBindingAuth: () => ['', true],
  mapDetectedComponents: jest.fn(),
  useAccessCheck: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({ auth: { getToken: () => Promise.resolve('token') } }),
}));

jest.mock('../../../shared/hooks', () => ({
  useFormikValidationFix: jest.fn(),
}));

const useAccessCheckMock = useAccessCheck as jest.Mock;

const renderSourceSection = () => {
  const onClick = jest.fn();

  const utils = formikRenderer(<SourceSection onSamplesClick={onClick} />, { source: '' });
  const user = userEvent.setup();

  return { input: utils.getByPlaceholderText('Enter your source'), ...utils, onClick, user };
};

afterEach(jest.resetAllMocks);

describe('SourceField', () => {
  it('renders input field and sample button', () => {
    useAccessCheckMock.mockReturnValue([{}, false]);
    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeInTheDocument();
    expect(screen.getByText('Start with a sample.')).toBeInTheDocument();
  });

  it('fires callback on sample button click', () => {
    useAccessCheckMock.mockReturnValue([{}, false]);

    const { onClick } = renderSourceSection();

    fireEvent.click(screen.getByText('Start with a sample.'));
    expect(onClick).toHaveBeenCalled();
  });

  it('displays error when repo is not accessible', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: false, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);

    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeInvalid();
    expect(screen.getByText('Unable to access repository')).toBeVisible();
  });

  it('validates input field when repo is accessible', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: true, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);

    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeValid();
    expect(screen.getByText('Validated')).toBeVisible();
  });

  it('should show Authorization when github repo is not accessible', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: false, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);

    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeInvalid();
    expect(screen.getByText('Unable to access repository')).toBeVisible();
    await waitFor(() => expect(screen.getByText('Authorization')).toBeInTheDocument());
  });

  it('should show Authorization if input is container image', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: true, isGit: false, serviceProvider: ServiceProviderType.Quay },
      null,
    ]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'quay.io/example/repo');

    await waitFor(() => expect(screen.getByText('Authorization')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Git options')).toBeNull());
  });

  it('should not show Authorization or Git options if input is invalid', async () => {
    useAccessCheckMock.mockReturnValue([{}, false]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'docker.io/example');

    await waitFor(() => expect(screen.queryByText('Authorization')).toBeNull());
    await waitFor(() => expect(screen.queryByText('Git options')).toBeNull());
  });

  it('should show git options for a valid git url and accessible', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: true, isGit: true, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'https://github.com/example/repo');

    await waitFor(() => expect(screen.queryByText('Git options')).toBeInTheDocument());

    await user.type(input, 'dummy text');

    await waitFor(() => expect(screen.queryByText('Git options')).toBeNull());
  });

  it('should validate a container image url starting with https:// or quay.io/', async () => {
    useAccessCheckMock.mockReturnValue([{}, false]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'https://quay.io/example/repo');

    await waitFor(() => expect(screen.getByPlaceholderText('Enter your source')).toBeValid());
    await waitFor(() => screen.getByText('Validated'));
  });

  it('should show proper states for valid url based on useAccessCheck Values', async () => {
    useAccessCheckMock.mockReturnValue([{}, false]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'https://github.com/example/repo');

    await waitFor(() => expect(screen.getByPlaceholderText('Enter your source')).toBeValid());
    await waitFor(() => screen.getByText('Validating...'));

    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: true, isGit: true, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);

    await user.type(input, 's');

    await waitFor(() => expect(screen.getByPlaceholderText('Enter your source')).toBeValid());
    await waitFor(() => screen.getByText('Validated'));
    await waitFor(() => expect(screen.getByText('Git options')).toBeInTheDocument());
  });
});
