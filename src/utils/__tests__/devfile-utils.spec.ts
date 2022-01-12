import { mockItems, getDevfileSamples } from '../devfile-utils';

const mockCatalogItem = mockItems.map(({ projectType, language, git, ...item }) => ({
  ...item,
  uid: item.name,
  name: item.displayName,
  icon: { url: item.icon },
  attributes: {
    projectType,
    language,
    git,
  },
}));

describe('Devfile Utils', () => {
  it('Should convert devfile samples to catalog items', async () => {
    const result = await getDevfileSamples();

    expect(result).toEqual(mockCatalogItem);
  });
});
