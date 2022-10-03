import * as React from 'react';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useFormikContext } from 'formik';
import { mockCatalogItem } from '../../../../utils/__data__/mock-devfile-data';
import { useComponentDetection } from '../../utils/cdq-utils';
import { useDevfileSamples } from '../../utils/useDevfileSamples';
import SampleSection from '../SampleSection';

import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-test' });

jest.mock('../../utils/useDevfileSamples', () => ({
  useDevfileSamples: jest.fn(),
}));

jest.mock('../../utils/cdq-utils', () => ({
  useComponentDetection: jest.fn().mockReturnValue([null, null, null]),
}));

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../../shared/hooks/useResizeObserver', () => ({
  useResizeObserver: jest.fn(),
}));

const onStrategyChangeMock = jest.fn();

const useFormikContextMock = useFormikContext as jest.Mock;

const useComponentDetectionMock = useComponentDetection as jest.Mock;

const useDevfileSamplesMock = useDevfileSamples as jest.Mock;

describe('SampleSection', () => {
  it('renders component samples page with a progressbar when samples are loading', async () => {
    useFormikContextMock.mockReturnValue({
      values: { source: '', application: { name: '' } },
      setFieldValue: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([[], false, null]);
    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);
    await screen.getByText('Select a sample');
    await screen.getByRole('progressbar');
  });

  it('renders component samples page with an empty state when no samples are loaded', async () => {
    useFormikContextMock.mockReturnValue({
      values: { source: '', application: { name: '' } },
      setFieldValue: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([[], true, null]);
    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);
    await waitFor(() => {
      screen.getByText('No Catalog items found');
    });
  });

  it('renders component samples page with nodejs sample tile', async () => {
    useFormikContextMock.mockReturnValue({
      values: { source: '', application: { name: '' } },
      setFieldValue: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([[mockCatalogItem[0]], true, null]);
    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);
    await waitFor(() => {
      screen.getByText('Basic Node.js');
    });
  });

  it('renders run useComponentDetection hook when a sample is selected', async () => {
    useFormikContextMock.mockReturnValue({
      values: { source: 'https://github.com/repo', application: 'test-app' },
      setFieldValue: jest.fn(),
      setStatus: jest.fn(),
    });
    useComponentDetectionMock.mockReturnValue([[], true, null]);
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);

    await waitFor(() => fireEvent.click(screen.getByText('Basic Node.js')));

    await waitFor(() => {
      expect(useComponentDetectionMock).toHaveBeenCalledWith('https://github.com/repo', 'test-app');
    });
  });

  it('validates form after a sample is selected', async () => {
    const setFieldValue = jest.fn();
    useFormikContextMock.mockReturnValue({
      values: { source: 'https://github.com/repo', application: 'test-app' },
      setFieldValue,
      setStatus: jest.fn(),
    });
    useComponentDetectionMock.mockReturnValue([[], true, null]);
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);

    await waitFor(() => fireEvent.click(screen.getByText('Basic Node.js')));

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenLastCalledWith('isValidated', true);
    });
  });

  it('unvalidates form after a selected sample is deselected', async () => {
    const setFieldValue = jest.fn();
    useFormikContextMock.mockReturnValue({
      values: { source: 'https://github.com/repo', application: 'test-app' },
      setFieldValue,
      setStatus: jest.fn(),
    });
    useComponentDetectionMock.mockReturnValue([[], true, null]);
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);

    await waitFor(() => fireEvent.click(screen.getByText('Basic Node.js')));

    useComponentDetectionMock.mockReturnValue([null, true, null]);
    await waitFor(() => fireEvent.click(screen.getByText('Basic Node.js')));

    await waitFor(() => {
      expect(setFieldValue).toHaveBeenLastCalledWith('isValidated', false);
    });
  });

  it('prefixes application to sample name', async () => {
    const setFieldValue = jest.fn();
    useFormikContextMock.mockReturnValue({
      values: { source: 'https://github.com/repo', application: 'MyApp' },
      setFieldValue,
      setStatus: jest.fn(),
    });
    useComponentDetectionMock.mockReturnValue([
      [{ componentStub: { componentName: 'node' } }],
      true,
      null,
    ]);
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);

    await waitFor(() => fireEvent.click(screen.getByText('Basic Node.js')));

    expect(setFieldValue).toHaveBeenCalledWith('components', [
      {
        componentStub: expect.objectContaining({
          componentName: 'myapp-node-sample',
        }),
      },
    ]);
  });

  it('sanitizes app prefix for sample name', async () => {
    const setFieldValue = jest.fn();
    useFormikContextMock.mockReturnValue({
      values: { source: 'https://github.com/repo', application: 'My Application' },
      setFieldValue,
      setStatus: jest.fn(),
    });
    useComponentDetectionMock.mockReturnValue([
      [{ componentStub: { componentName: 'node' } }],
      true,
      null,
    ]);
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);

    await waitFor(() => fireEvent.click(screen.getByText('Basic Node.js')));

    expect(setFieldValue).toHaveBeenCalledWith('components', [
      {
        componentStub: expect.objectContaining({
          componentName: 'my-application-node-sample',
        }),
      },
    ]);
  });

  it('should show loading indicator while detecting components', async () => {
    const setFieldValue = jest.fn();
    useFormikContextMock.mockReturnValue({
      values: { source: 'https://github.com/repo', application: 'test-app' },
      setFieldValue,
      setStatus: jest.fn(),
    });
    useComponentDetectionMock.mockReturnValue([null, false, null]);
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);

    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    await waitFor(() => fireEvent.click(screen.getByText('Basic Node.js')));

    await waitFor(() => screen.getByRole('progressbar'));
  });
});
