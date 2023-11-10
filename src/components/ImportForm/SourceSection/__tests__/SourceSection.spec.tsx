import * as React from 'react';
import { configure, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SPIAccessCheckAccessibilityStatus, ServiceProviderType } from '../../../../types';
import { formikRenderer } from '../../../../utils/test-utils';
import { useAccessCheck, useAccessTokenBinding } from '../../utils/auth-utils';
import { ImportFormValues } from '../../utils/types';
import SourceSection from '../SourceSection';

import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-test' });

jest.mock('../useEnablePrivateAuthFlowFlag', () => ({
  useEnablePrivateAuthFlowFlag: () => true,
}));

jest.mock('../../utils/auth-utils', () => ({
  useAccessTokenBinding: jest.fn(),
  useAccessCheck: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    auth: { getToken: () => Promise.resolve('token') },
    helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn(), disableTopics: jest.fn() },
  }),
}));

jest.mock('@openshift/dynamic-plugin-sdk', () => {
  const actual = jest.requireActual('@openshift/dynamic-plugin-sdk');
  return { ...actual, useFeatureFlag: () => [false] };
});

jest.mock('../../../../shared/hooks', () => ({
  useFormikValidationFix: jest.fn(),
}));

const useAccessCheckMock = useAccessCheck as jest.Mock;
const useBindingMock = useAccessTokenBinding as jest.Mock;

const renderSourceSection = (formikData?: Omit<ImportFormValues, 'application' | 'namespace'>) => {
  const onClick = jest.fn();
  const data = formikData || { source: { git: { url: '' } } };

  const utils = formikRenderer(<SourceSection />, data);
  const user = userEvent.setup();

  return { input: utils.getByPlaceholderText('Enter your source'), ...utils, onClick, user };
};

afterEach(jest.resetAllMocks);

describe('SourceSection', () => {
  it('renders input field', () => {
    useAccessCheckMock.mockReturnValue([{}, false]);
    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeInTheDocument();
  });

  it('displays error when repo is not accessible', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: false, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);
    useBindingMock.mockReturnValue(['', true]);

    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeInvalid();
    expect(
      screen.getByText("Looks like your repository is private, so we're not able to access it."),
    ).toBeVisible();
  });

  it('displays error when provider is not supported', async () => {
    useAccessCheckMock.mockReturnValue([{ isRepoAccessible: false, serviceProvider: '' }, true]);

    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeInvalid();
    expect(screen.getByText('This provider is not supported')).toBeVisible();
  });

  it('validates input field when repo is accessible', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: true, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);

    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeValid();
    expect(screen.getByText('Access validated')).toBeVisible();
  });

  it('displays error when repo is not a source repo', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: true, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);
    useBindingMock.mockReturnValue(['', true]);

    const { input, user } = renderSourceSection();
    await user.type(input, 'https://github.com/openshift/');

    await waitFor(() => expect(screen.getByPlaceholderText('Enter your source')).toBeInvalid());
    await waitFor(() =>
      expect(screen.getByText("That repository URL isn't quite right. Try again.")).toBeVisible(),
    );
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

    await waitFor(() => {
      expect(screen.queryByText('Git reference')).toBeInTheDocument();
      expect(screen.queryByText('Context directory')).toBeInTheDocument();
    });
  });

  it('should not show git options for invalid git url', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: false, isGit: true, serviceProvider: ServiceProviderType.GitHub },
      false,
    ]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'dummy text');

    await waitFor(() => {
      expect(screen.queryByText('Git reference')).toBeNull();
      expect(screen.queryByText('Context directory')).toBeNull();
    });
  });

  it('should show proper states for valid url based on useAccessCheck Values', async () => {
    useAccessCheckMock.mockReturnValue([{}, false]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'https://github.com/example/repo');

    await waitFor(() => expect(screen.getByPlaceholderText('Enter your source')).toBeValid());
    await waitFor(() => screen.getByText('Checking access...'));

    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: true, isGit: true, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);

    await user.type(input, 's');

    await waitFor(() => expect(screen.getByPlaceholderText('Enter your source')).toBeValid());
    await waitFor(() => screen.getByText('Access validated'));
    await waitFor(() => expect(screen.getByText('Git reference')).toBeInTheDocument());
  });

  it('should render git only option', () => {
    useAccessCheckMock.mockReturnValue([{}, false]);
    renderSourceSection();
    expect(screen.queryByText(/container/)).toBeNull();
  });

  it('should not run detection again if repo is previously entered and validated', () => {
    useAccessCheckMock.mockReturnValue([{}, false]);
    renderSourceSection({
      source: { git: { url: 'https://example.com' }, isValidated: true },
    });
    expect(useAccessCheckMock).toHaveBeenCalledWith(null, undefined);
    expect(screen.getByText('Access validated')).toBeVisible();
    expect(screen.queryByText('Git reference')).toBeVisible();
  });

  it('should run detection if repo is previously entered but not validated', () => {
    useAccessCheckMock.mockReturnValue([{}, false]);
    renderSourceSection({
      source: { git: { url: 'https://example.com' }, isValidated: false },
    });
    expect(useAccessCheckMock).toHaveBeenCalledWith('https://example.com', '');
    expect(screen.queryByText('Access validated')).not.toBeInTheDocument();
  });

  it('should set reference and context directory when present in url segment', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: true, isGit: true, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);

    const { input, user } = renderSourceSection();

    await user.type(input, 'https://github.com/example/repo');

    await waitFor(() => {
      expect(screen.getByTestId('git-reference')).toHaveValue('');
      expect(screen.getByTestId('context-dir')).toHaveValue('');
    });

    await user.type(input, 'https://github.com/example/repo/tree/main/my-dir');

    await waitFor(() => {
      expect(screen.getByTestId('git-reference')).toHaveValue('main');
      expect(screen.getByTestId('context-dir')).toHaveValue('my-dir');
    });
  });

  it('should show Authorization when github repo is not accessible', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: false, serviceProvider: ServiceProviderType.GitHub },
      true,
    ]);
    useBindingMock.mockReturnValue(['', true]);

    renderSourceSection();

    expect(screen.getByPlaceholderText('Enter your source')).toBeInvalid();
    expect(
      screen.getByText("Looks like your repository is private, so we're not able to access it."),
    ).toBeVisible();
    await waitFor(() => expect(screen.getByText('Authorization')).toBeInTheDocument());
  });

  it('should show Authorization if container image is not accessible', async () => {
    useAccessCheckMock.mockReturnValue([
      { isRepoAccessible: false, isGit: false, serviceProvider: ServiceProviderType.Quay },
      true,
    ]);
    useBindingMock.mockReturnValue(['', true]);

    renderSourceSection();

    await waitFor(() => expect(screen.getByText('Authorization')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Git options')).toBeNull());
  });

  it('should fetch secret if private repository has been previously authenticated', async () => {
    useAccessCheckMock.mockReturnValue([
      {
        isRepoAccessible: true,
        isGit: true,
        serviceProvider: ServiceProviderType.GitHub,
        accessibility: SPIAccessCheckAccessibilityStatus.private,
      },
      true,
    ]);

    const { input, user } = renderSourceSection();

    expect(useBindingMock).toHaveBeenCalledWith('');
    await user.type(input, 'https://github.com/example/repo');
    expect(useBindingMock).toHaveBeenCalledWith('https://github.com/example/repo');
  });
});
