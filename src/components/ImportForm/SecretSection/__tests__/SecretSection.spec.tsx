import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { screen, fireEvent, act, waitFor } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import SecretSection from '../SecretSection';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('SecretSection', () => {
  beforeEach(() => {
    watchResourceMock.mockReturnValue([[], true]);
  });
  it('should render secret section', () => {
    formikRenderer(<SecretSection />, {});

    screen.getByText('Secrets');
    screen.getByTestId('add-secret-button');
  });

  it('should render added secrets in removable lists', () => {
    formikRenderer(<SecretSection />, { newSecrets: ['secret-one', 'secret-two'] });

    expect(screen.queryByDisplayValue('secret-one')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('secret-two')).toBeInTheDocument();
  });

  it('should be able to remove the newly added secrets from the list', async () => {
    formikRenderer(<SecretSection />, { secrets: [], newSecrets: ['secret-one', 'secret-two'] });

    expect(screen.queryByDisplayValue('secret-one')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('secret-two')).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByTestId('newSecrets-1-remove-button'));
    });

    await waitFor(() => {
      expect(screen.queryByDisplayValue('secret-two')).not.toBeInTheDocument();
    });
  });
});
