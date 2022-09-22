import * as React from 'react';
import { configure, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createIntegrationTest } from '../../ImportForm/create-utils';
import IntegrationTestView from '../IntegrationTestView';

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => navigateMock,
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../ImportForm/create-utils', () => ({
  createIntegrationTest: jest.fn(),
}));

const createIntegrationTestMock = createIntegrationTest as jest.Mock;

configure({ testIdAttribute: 'data-test' });

class MockResizeObserver {
  observe() {
    // do nothing
  }

  unobserve() {
    // do nothing
  }

  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = MockResizeObserver;

describe('IntegrationTestView', () => {
  const fillIntegrationTestForm = (wrapper: RenderResult) => {
    fireEvent.input(wrapper.getByLabelText('Display name'), { target: { value: 'new test name' } });
    fireEvent.input(wrapper.getByLabelText('Container image'), {
      target: { value: 'quay.io/kpavic/test-bundle:pipeline' },
    });
    fireEvent.input(wrapper.getByLabelText('Pipeline specified in container image'), {
      target: { value: 'new-test-pipeline' },
    });
  };
  it('should render the form by default', async () => {
    const wrapper = render(<IntegrationTestView applicationName="test-app" />);
    await expect(wrapper).toBeTruthy();

    wrapper.getByLabelText('Display name');
    wrapper.getByLabelText('Container image');
    wrapper.getByLabelText('Pipeline specified in container image');
    wrapper.getByRole('button', { name: 'Add integration test pipeline' });
  });

  it('should enable the submit button when there are no errors', async () => {
    const wrapper = render(<IntegrationTestView applicationName="test-app" />);
    await expect(wrapper).toBeTruthy();

    const submitButton = wrapper.getByRole('button', { name: 'Add integration test pipeline' });
    expect(submitButton).toBeDisabled();
    fillIntegrationTestForm(wrapper);
    expect(submitButton).toBeEnabled();
  });

  it('should navigate to the integration test tab on submit', async () => {
    createIntegrationTestMock.mockImplementation(() => {
      return new Promise<void>((resolve) => {
        resolve();
      });
    });
    const wrapper = render(<IntegrationTestView applicationName="test-app" />);
    await expect(wrapper).toBeTruthy();

    fillIntegrationTestForm(wrapper);

    const submitButton = wrapper.getByRole('button', { name: 'Add integration test pipeline' });
    expect(submitButton).toBeTruthy();
    expect(submitButton).toBeEnabled();

    await waitFor(() => fireEvent.click(submitButton));
    await waitFor(() => expect(createIntegrationTestMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        '/app-studio/applications/test-app?activeTab=integrationtests',
      ),
    );
  });
});
