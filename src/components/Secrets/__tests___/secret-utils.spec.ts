import {
  getSupportedPartnerTaskKeyValuePairs,
  isPartnerTask,
  supportedPartnerTasksSecrets,
} from '../secret-utils';

describe('getSupportedPartnerTaskKeyValuePairs', () => {
  it('should return empty array ', () => {
    expect(getSupportedPartnerTaskKeyValuePairs()).toEqual([]);
    expect(getSupportedPartnerTaskKeyValuePairs(null)).toEqual([]);
  });

  it('should return snyk secret values ', () => {
    expect(getSupportedPartnerTaskKeyValuePairs('snyk-secret')).toEqual([
      { key: 'snyk_token', readOnlyKey: true, value: '' },
    ]);
  });
});

describe('getSupportedPartnerTaskKeyValuePairs', () => {
  it('should return true if supported partner task name is provided ', () => {
    Object.values(supportedPartnerTasksSecrets).map(({ name }) => {
      expect(isPartnerTask(name)).toBe(true);
    });
  });

  it('should return false if unsupport task name is provided ', () => {
    expect(isPartnerTask(null)).toBe(false);
    expect(isPartnerTask(undefined)).toBe(false);
    expect(isPartnerTask('invalid-partner-task')).toBe(false);
  });
});
