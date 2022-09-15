import { renderHook } from '@testing-library/react-hooks';
import { useDevfileSamples } from '../useDevfileSamples';
import { HttpError } from './../../../../shared/utils/error/http-error';
import { mockCatalogItem } from './../../../../utils/__data__/mock-devfile-data';
import { getDevfileSamples } from './../../../../utils/devfile-utils';

jest.mock('./../../../../utils/devfile-utils', () => ({
  getDevfileSamples: jest.fn(),
}));

const getDevfileSamplesMock = getDevfileSamples as jest.Mock;

describe('useDevfileSamples', () => {
  it('should return devfile samples', async () => {
    getDevfileSamplesMock.mockResolvedValue(mockCatalogItem);

    const { result, waitForNextUpdate } = renderHook(() => useDevfileSamples());

    await waitForNextUpdate();

    expect(result.current).toStrictEqual([mockCatalogItem, true, undefined]);
  });

  it('should return error message', async () => {
    getDevfileSamplesMock.mockRejectedValue(new HttpError('Something went wrong!'));

    const { result, waitForNextUpdate } = renderHook(() => useDevfileSamples());

    await waitForNextUpdate();

    expect(result.current).toStrictEqual([
      [],
      false,
      'Failed to load devfile samples: Something went wrong!',
    ]);
  });
});
