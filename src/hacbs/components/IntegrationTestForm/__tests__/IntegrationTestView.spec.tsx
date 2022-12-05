import * as React from 'react';
import { configure, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createIntegrationTest } from '../../ImportForm/create-utils';
import { MockIntegrationTests } from '../../IntegrationTestsListView/__data__/mock-integration-tests';
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
    fireEvent.input(wrapper.getByLabelText(/Integration test name/), {
      target: { value: 'new-test-name' },
    });
    fireEvent.input(wrapper.getByLabelText(/Image bundle/), {
      target: { value: 'quay.io/kpavic/test-bundle:pipeline' },
    });
    fireEvent.input(wrapper.getByLabelText(/Pipeline to run/), {
      target: { value: 'new-test-pipeline' },
    });
  };
  it('should render the form by default', async () => {
    const wrapper = render(<IntegrationTestView applicationName="test-app" />);
    await expect(wrapper).toBeTruthy();

    wrapper.getByLabelText(/Integration test name/);
    wrapper.getByLabelText(/Image bundle/);
    wrapper.getByLabelText(/Pipeline to run/);
    wrapper.getByRole('button', { name: 'Add integration test' });
  });

  it('should enable the submit button when there are no errors', async () => {
    const wrapper = render(<IntegrationTestView applicationName="test-app" />);
    await expect(wrapper).toBeTruthy();

    const submitButton = wrapper.getByRole('button', { name: 'Add integration test' });
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

    const submitButton = wrapper.getByRole('button', { name: 'Add integration test' });
    expect(submitButton).toBeTruthy();
    expect(submitButton).toBeEnabled();

    await waitFor(() => fireEvent.click(submitButton));
    await waitFor(() => expect(createIntegrationTestMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith(
        '/stonesoup/applications/test-app?activeTab=integrationtests',
      ),
    );
  });

  it('should init values from provided integration test', async () => {
    const integrationTest = MockIntegrationTests[0];
    const wrapper = render(
      <IntegrationTestView applicationName="test-app" integrationTest={integrationTest} />,
    );

    expect((await wrapper.getByLabelText(/Integration test name/)).getAttribute('value')).toBe(
      integrationTest.metadata.name,
    );
    expect((await wrapper.getByLabelText(/Image bundle/)).getAttribute('value')).toBe(
      integrationTest.spec.bundle,
    );
    expect((await wrapper.getByLabelText(/Pipeline to run/)).getAttribute('value')).toBe(
      integrationTest.spec.pipeline,
    );
  });

  it('should be in edit mode', async () => {
    const integrationTest = MockIntegrationTests[0];
    const wrapper = render(
      <IntegrationTestView applicationName="test-app" integrationTest={integrationTest} />,
    );

    expect(((await wrapper.getByText(/Save changes/)) as HTMLButtonElement).disabled).toBe(true);
    (await wrapper.getByLabelText(/Integration test name/)).setAttribute('value', 'new value');
  });
});
