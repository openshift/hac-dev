import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { configure, render } from '@testing-library/react';
import { useField, useFormikContext } from 'formik';
import IntegrationTestSection from '../IntegrationTestSection';

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useNavigate: () => navigateMock,
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
  useField: jest.fn(),
}));

const useFormikContextMock = useFormikContext as jest.Mock;

const useFieldMock = useField as jest.Mock;

configure({ testIdAttribute: 'data-test' });

describe('IntegrationTestSection', () => {
  it('should render the page header by default', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    useFormikContextMock.mockReturnValue({
      setTouched: () => {},
      values: { source: 'test-source', secret: null },
      setFieldValue: jest.fn(),
      useField: () => ['', { touched: false, error: undefined }],
      setStatus: jest.fn(),
    });
    useFieldMock.mockReturnValue([{ value: false }, { touched: false, error: null }]);
    const wrapper = render(<IntegrationTestSection />);
    await expect(wrapper).toBeTruthy();
    expect(wrapper.getByTestId('integration-test-section-header')).toBeTruthy();
  });
  it('should hide the page header when isInPage is set', async () => {
    useK8sWatchResourceMock.mockReturnValue([[], false]);
    useFormikContextMock.mockReturnValue({
      setTouched: () => {},
      values: { source: 'test-source', secret: null },
      setFieldValue: jest.fn(),
      useField: () => ['', { touched: false, error: undefined }],
      setStatus: jest.fn(),
    });
    useFieldMock.mockReturnValue([{ value: false }, { touched: false, error: null }]);
    const wrapper = render(<IntegrationTestSection isInPage />);
    let found;
    try {
      wrapper.getByTestId('integration-test-section-header');
      found = true;
    } catch {
      found = false;
    }
    expect(found).toEqual(false);
  });
});
