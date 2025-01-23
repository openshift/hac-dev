import { extractEcResultsFromTaskRunLogs } from '../utils';

describe('extractEcResultsFromTaskRunLogs', () => {
  test('should extract and parse JSON from logs correctly', () => {
    const logs = `
      step-vulnerabilities :-
      Lorem Ipsum some logs
      
      step-report-json :-
      {"success":true,"components":[{"name":"component-name","details":"example"}]}
      
      step-something-else :-
      Some other logs
    `;

    const expectedResult = {
      success: true,
      components: [
        {
          name: 'component-name',
          details: 'example',
        },
      ],
    };
    expect(extractEcResultsFromTaskRunLogs(logs)).toEqual(expectedResult);
  });

  test('should return null if JSON parsing fails', () => {
    const logs = `
      step-report-json :-
      {invalid JSON}
    `;
    expect(extractEcResultsFromTaskRunLogs(logs)).toBeNull();
  });

  test('should return null if step-report-json is missing', () => {
    const logs = `
      step-vulnerabilities :-
      Lorem Ipsum some logs
    `;

    expect(extractEcResultsFromTaskRunLogs(logs)).toBeNull();
  });

  test('should handle multiple step-report-json blocks and extract the first one', () => {
    const logs = `
      step-report-json :-
      {"success":true,"components":[{"name":"first-component","details":"example"}]}
      
      step-report-json :-
      {"success":false,"components":[{"name":"second-component","details":"example"}]}
    `;

    const expectedResult = {
      success: true,
      components: [
        {
          name: 'first-component',
          details: 'example',
        },
      ],
    };
    expect(extractEcResultsFromTaskRunLogs(logs)).toEqual(expectedResult);
  });

  test('should handle empty logs and return null', () => {
    expect(extractEcResultsFromTaskRunLogs(``)).toBeNull();
  });
});
