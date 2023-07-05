import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen, configure, fireEvent } from '@testing-library/react';
import { EnterpriseContractPolicyKind } from '../../../types';
import { GettingStartedModal, LOCAL_STORAGE_KEY } from '../GettingStartedModal';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  getActiveWorkspace: jest.fn(),
  useK8sWatchResource: jest.fn((): [EnterpriseContractPolicyKind[], boolean] => [
    [
      {
        apiVersion: 'appstudio.redhat.com/v1alpha1',
        kind: 'EnterpriseContractPolicy',
        spec: { sources: [{ git: { repository: 'test' } }] },
      },
    ],
    true,
  ]),
}));

jest.mock('../../../hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

describe('GettingStartedModal', () => {
  let modalValue;
  beforeAll(() => {
    modalValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  });
  afterAll(() => {
    modalValue
      ? localStorage.setItem(LOCAL_STORAGE_KEY, modalValue)
      : localStorage.removeItem(LOCAL_STORAGE_KEY);
  });

  it('should not show a modal when localstorage key is set to true', () => {
    render(<GettingStartedModal />);
    expect(screen.queryByTestId('getting-started-modal--content')).not.toBeInTheDocument();
  });

  it('should show a modal when localstorage key is set to false', () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    render(<GettingStartedModal />);
    expect(screen.queryByTestId('getting-started-modal')).toBeInTheDocument();
  });

  it('should render second screen when user clicks Next', () => {
    render(<GettingStartedModal />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByTestId('onboarding-modal--level1viz')).toBeInTheDocument();
    expect(screen.queryByTestId('onboarding-modal-level1alert')).toBeInTheDocument();
  });
});
