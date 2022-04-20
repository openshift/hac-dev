import * as React from 'react';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useFormikContext } from 'formik';
import { mockCatalogItem } from '../../../../utils/__data__/mock-devfile-data';
import { getDevfileSamples } from '../../../../utils/devfile-utils';
import { useComponentDetection } from '../../utils/cdq-utils';
import SampleSection from '../SampleSection';

import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-test' });

jest.mock('../../../../utils/devfile-utils', () => ({
  getDevfileSamples: jest.fn(),
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

const onStrategyChangeMock = jest.fn();

const useFormikContextMock = useFormikContext as jest.Mock;

const useComponentDetectionMock = useComponentDetection as jest.Mock;

const getDevfileMock = getDevfileSamples as jest.Mock;

describe('SampleSection', () => {
  it('renders component samples page with a progressbar when samples are loading', async () => {
    useFormikContextMock.mockReturnValue({ values: { source: '', application: { name: '' } } });
    getDevfileMock.mockReturnValue(Promise.resolve(null));
    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);
    await screen.getByText('Select a sample');
    await screen.getByRole('progressbar');
  });

  it('renders component samples page with an empty state when no samples are loaded', async () => {
    useFormikContextMock.mockReturnValue({ values: { source: '', application: { name: '' } } });
    getDevfileMock.mockReturnValue(Promise.resolve([]));
    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);
    await waitFor(() => {
      screen.getByText('No Catalog items found');
    });
  });

  it('renders component samples page with nodejs sample tile', async () => {
    useFormikContextMock.mockReturnValue({ values: { source: '', application: { name: '' } } });
    getDevfileMock.mockReturnValue(Promise.resolve([mockCatalogItem[0]]));
    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);
    await waitFor(() => {
      screen.getByText('Basic Node.js');
    });
  });

  it('renders run useComponentDetection hook when a sample is selected', async () => {
    useFormikContextMock.mockReturnValue({
      values: { source: 'https://github.com/repo', application: { name: 'test-app' } },
      setFieldValue: jest.fn(),
      setStatus: jest.fn(),
    });
    useComponentDetectionMock.mockReturnValue([[], true, null]);
    getDevfileMock.mockReturnValue(Promise.resolve(mockCatalogItem));

    render(<SampleSection onStrategyChange={onStrategyChangeMock} />);

    await waitFor(() => fireEvent.click(screen.getByText('Basic Node.js')));

    await waitFor(() => {
      expect(useComponentDetectionMock).toHaveBeenCalledWith('https://github.com/repo', 'test-app');
    });
  });
});
