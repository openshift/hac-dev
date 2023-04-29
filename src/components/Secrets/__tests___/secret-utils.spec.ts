import { getSupportedPartnerTaskKeyValuePairs } from '../secret-utils';

describe('getSupportedPartnerTaskKeyValuePairs', () => {
  it('should return default values ', () => {
    expect(getSupportedPartnerTaskKeyValuePairs()).toEqual([
      { key: '', readOnlyKey: false, value: '' },
    ]);
  });

  it('should return snyk secret values ', () => {
    expect(getSupportedPartnerTaskKeyValuePairs('snyk-secret')).toEqual([
      { key: 'snyk_token', readOnlyKey: true, value: '' },
    ]);
  });
});
