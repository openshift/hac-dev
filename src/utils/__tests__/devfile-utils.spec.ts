import { mockItems } from '../__data__/mock-devfile-data';
import { getDevfileSamples } from '../devfile-utils';

global.fetch = jest.fn().mockImplementationOnce(() => {
  return new Promise((resolve) => {
    resolve({
      ok: true,
      json: () => mockItems,
    });
  });
});

describe('Devfile Utils', () => {
  it('Should convert devfile samples to catalog items', async () => {
    const result = await getDevfileSamples();

    expect(result).toMatchSnapshot();
  });
});
