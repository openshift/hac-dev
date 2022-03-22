import uniq from 'lodash/uniq';

export const keywordFilter = <T>(
  filterText: string,
  items: T[],
  compareFunction: (keyword: string, item: T) => boolean,
): T[] => {
  if (!filterText) {
    return items;
  }
  const keywords = uniq(filterText.match(/\S+/g)).map((w) => w.toLowerCase());

  // Sort the longest keyword fist
  keywords.sort(function (a: string, b: string) {
    return b.length - a.length;
  });

  return items.filter((item) => {
    return keywords.every((keyword) => {
      return compareFunction(keyword, item);
    });
  });
};
