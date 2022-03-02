import { catalogItems } from '../catalog-data';
import { categorize, matchSubcategories } from '../utils/category-utils';

describe('category-utils', () => {
  it('should not return any matched sub categories', () => {
    const catalogCategory = {
      id: '',
      label: '',
    };
    const matchedSubcategories = matchSubcategories(catalogCategory, catalogItems[0]);
    expect(matchedSubcategories).toStrictEqual([]);
  });

  it('should return categorizeIds', () => {
    const catalogCategory = [
      {
        id: '1',
        label: 'Node',
        tags: ['NodeJS', 'Express'],
      },
    ];
    const categorizeIds = {
      '1': ['nodejs-basic'],
      all: ['nodejs-basic', 'python-basic', 'code-with-quarkus', 'quarkus'],
      other: ['python-basic', 'code-with-quarkus', 'quarkus'],
    };
    const categorizedIds = categorize(catalogItems, catalogCategory);
    expect(categorizedIds).toStrictEqual(categorizeIds);
  });
});
