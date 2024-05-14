import * as React from 'react';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useFormikContext } from 'formik';
import { mockCatalogItem } from '../../../../../utils/__data__/mock-devfile-data';
import SampleSection from '../SampleSection';
import { useDevfileSamples } from '../useDevfileSamples';

import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-test' });

jest.mock('../../utils/useDevfileSamples', () => ({
  useDevfileSamples: jest.fn(),
}));

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

const onSampleImportMock = jest.fn();

const useFormikContextMock = useFormikContext as jest.Mock;

const useDevfileSamplesMock = useDevfileSamples as jest.Mock;

describe('SampleSection', () => {
  it('renders component samples page with a progressbar when samples are loading', async () => {
    useFormikContextMock.mockReturnValue({
      values: { source: { git: {} }, application: { name: '' } },
      setFieldValue: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([[], false, null]);
    render(<SampleSection onSampleImport={onSampleImportMock} />);
    await screen.getByRole('progressbar');
  });

  it('renders component samples page with an empty state when no samples are loaded', async () => {
    useFormikContextMock.mockReturnValue({
      values: { source: { git: {} }, application: { name: '' } },
      setFieldValue: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([[], true, null]);
    render(<SampleSection onSampleImport={onSampleImportMock} />);
    await waitFor(() => {
      screen.getByText('No Catalog items found');
    });
  });

  it('renders component samples page with nodejs sample tile', async () => {
    useFormikContextMock.mockReturnValue({
      values: { source: { git: {} }, application: { name: '' } },
      setFieldValue: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([[mockCatalogItem[0]], true, null]);
    render(<SampleSection onSampleImport={onSampleImportMock} />);
    await waitFor(() => {
      screen.getByText('Basic Node.js');
    });
  });

  it('should call onSampleImport when user clicks on CTA', async () => {
    const setFieldValue = jest.fn();
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'https://github.com/repo' } }, application: 'test-app' },
      setFieldValue,
      setStatus: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onSampleImport={onSampleImportMock} />);

    await waitFor(() => fireEvent.click(screen.getByTestId('import-sample-Basic Node.js')));

    await waitFor(() => {
      expect(onSampleImportMock).toHaveBeenLastCalledWith(
        'https://github.com/nodeshift-starters/devfile-sample.git',
        'Basic Node.js',
      );
    });
  });

  it('should show empty state for filtered samples', async () => {
    const setFieldValue = jest.fn();
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'https://github.com/repo' } }, application: 'test-app' },
      setFieldValue,
      setStatus: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onSampleImport={onSampleImportMock} />);

    await waitFor(() =>
      fireEvent.input(screen.getByPlaceholderText('Filter by keyword...'), {
        target: { value: 'asdf' },
      }),
    );

    await waitFor(() => screen.getByText('No results found'));

    await waitFor(() => fireEvent.click(screen.getByText('Clear all filters')));

    await waitFor(() => screen.getByText('Basic Node.js'));
    await waitFor(() => screen.getByText('Basic Quarkus'));
  });

  it('should filter sample items based on input value', async () => {
    const setFieldValue = jest.fn();
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'https://github.com/repo' } }, application: 'test-app' },
      setFieldValue,
      setStatus: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onSampleImport={onSampleImportMock} />);

    await waitFor(() => screen.getByText('Basic Node.js'));
    await waitFor(() => screen.getByText('Basic Quarkus'));

    await waitFor(() =>
      fireEvent.input(screen.getByPlaceholderText('Filter by keyword...'), {
        target: { value: 'node' },
      }),
    );

    await waitFor(() => screen.getByText('Basic Node.js'));
    await waitFor(() => expect(screen.queryByText('Basic Quarkus')).not.toBeInTheDocument());
  });

  it('should filter sample items based on tags', async () => {
    const setFieldValue = jest.fn();
    useFormikContextMock.mockReturnValue({
      values: { source: { git: { url: 'https://github.com/repo' } }, application: 'test-app' },
      setFieldValue,
      setStatus: jest.fn(),
    });
    useDevfileSamplesMock.mockReturnValue([mockCatalogItem, true, null]);

    render(<SampleSection onSampleImport={onSampleImportMock} />);

    await waitFor(() => screen.getByText('Basic Node.js'));
    await waitFor(() => screen.getByText('Basic Quarkus'));
    await waitFor(() => screen.getByText('Basic Python'));
    await waitFor(() => screen.getByText('Basic Spring Boot'));

    await waitFor(() =>
      fireEvent.input(screen.getByPlaceholderText('Filter by keyword...'), {
        target: { value: 'spring' },
      }),
    );

    await waitFor(() => screen.getByText('Basic Spring Boot'));
    await waitFor(() => expect(screen.queryByText('Basic Node.js')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Basic Quarkus')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Basic Python')).not.toBeInTheDocument());
  });
});
