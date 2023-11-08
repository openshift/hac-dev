import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import identity from 'lodash-es/identity';
import { SpaceBindingRequest } from '../../../../types';
import { namespaceRenderer } from '../../../../utils/test-utils';
import { createSBRs, editSBR, validateUsername } from '../form-utils';
import { UserAccessFormPage } from '../UserAccessFormPage';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: identity })),
}));

jest.mock('../../../../utils/analytics', () => ({
  ...jest.requireActual<any>('../../../../utils/analytics'),
  useTrackEvent: jest.fn(() => jest.fn),
}));

jest.mock('../../../../utils/breadcrumb-utils', () => ({
  useWorkspaceBreadcrumbs: jest.fn(() => []),
}));

jest.mock('../../../../shared/hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual<any>('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../form-utils', () => ({
  ...jest.requireActual<any>('../form-utils'),
  validateUsername: jest.fn(),
  createSBRs: jest.fn(),
  editSBR: jest.fn(),
}));

const createSBRsMock = createSBRs as jest.Mock;
const editSBRsMock = editSBR as jest.Mock;
const validateUsernameMock = validateUsername as jest.Mock;

describe('UserAccessFormPage', () => {
  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllMocks);

  it('should create resources on submit', async () => {
    createSBRsMock.mockResolvedValue({});
    validateUsernameMock.mockResolvedValue(true);
    const updateWsMock = jest.fn();
    namespaceRenderer(<UserAccessFormPage />, 'test-ns', {
      workspace: 'test-ws',
      workspaceResource: {} as any,
      updateWorkspace: updateWsMock,
    });
    expect(screen.getByText('Grant access to workspace, test-ws')).toBeVisible();
    await act(async () => {
      fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'user1' } });
    });
    await act(async () => {
      jest.runAllTimers();
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Select role'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('maintainer'));
    });
    expect(screen.getByRole('button', { name: 'Grant access' })).toBeEnabled();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Grant access' }));
    });
    expect(createSBRsMock).toHaveBeenCalledTimes(2);
    expect(createSBRsMock).toHaveBeenCalledWith(
      { role: 'maintainer', usernames: ['user1'] },
      'test-ns',
    );
    expect(updateWsMock).toHaveBeenCalledTimes(1);
  });

  it('should create resources for edit when existing sbr is not available', async () => {
    validateUsernameMock.mockResolvedValue(true);
    const updateWsMock = jest.fn();
    namespaceRenderer(<UserAccessFormPage username="myuser" edit />, 'test-ns', {
      workspace: 'test-ws',
      workspaceResource: {} as any,
      updateWorkspace: updateWsMock,
    });
    expect(screen.getByText('Edit access to workspace, test-ws')).toBeVisible();
    expect(screen.getByRole('searchbox')).toBeDisabled();
    await act(async () => {
      fireEvent.click(screen.getByText('Select role'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('maintainer'));
    });
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    });
    expect(createSBRsMock).toHaveBeenCalledTimes(2);
    expect(createSBRsMock).toHaveBeenCalledWith(
      { role: 'maintainer', usernames: ['myuser'] },
      'test-ns',
    );
    expect(updateWsMock).toHaveBeenCalledTimes(1);
  });

  it('should update resources when existing sbr is provided', async () => {
    editSBRsMock.mockResolvedValue({});
    validateUsernameMock.mockResolvedValue(true);
    const updateWsMock = jest.fn();
    const mockSBR: SpaceBindingRequest = {
      apiVersion: 'appstudio.redhat.com/v1alpha1',
      kind: 'SpaceBindingRequest',
      metadata: {
        name: 'test-sbr',
      },
      spec: {
        masterUserRecord: 'user1',
        spaceRole: 'contributor',
      },
    };
    namespaceRenderer(
      <UserAccessFormPage username="user1" existingSbr={mockSBR} edit />,
      'test-ns',
      {
        workspace: 'test-ws',
        workspaceResource: {} as any,
        updateWorkspace: updateWsMock,
      },
    );
    expect(screen.getByRole('searchbox')).toBeDisabled();
    await act(async () => {
      fireEvent.click(screen.getByText('contributor'));
    });
    await act(async () => {
      fireEvent.click(screen.getByText('maintainer'));
    });
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    });
    expect(editSBRsMock).toHaveBeenCalledTimes(2);
    expect(editSBRsMock).toHaveBeenCalledWith(
      { role: 'maintainer', usernames: ['user1'] },
      mockSBR,
    );
    expect(updateWsMock).toHaveBeenCalledTimes(1);
  });
});
