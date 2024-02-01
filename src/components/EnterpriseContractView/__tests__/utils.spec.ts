import { extractEcResultsFromTaskRunLogs } from '../utils';

describe('extractEcResultsFromTaskRunLogs', () => {
  it('should extract logs from string ', () => {
    expect(
      extractEcResultsFromTaskRunLogs(`asdfcdfadsf
    [report-json] { "components": [] }
    `),
    ).toEqual({ components: [] });
    expect(
      extractEcResultsFromTaskRunLogs(`asdfcdfadsf
    [report-json] { "components":
    [report-json] [] }
    safkjasdfj 9034823 0dju@#$@#
    `),
    ).toEqual({ components: [] });

    expect(
      extractEcResultsFromTaskRunLogs(`asdfcdfadsf
    [report] { "components": [] }
    [report-json] { "components":
    [report-json] [] }
    safkjasdfj 9034823 0dju@#$@#
    `),
    ).toEqual({ components: [] });
  });
});
