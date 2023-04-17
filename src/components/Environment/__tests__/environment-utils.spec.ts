import { EnvironmentKind } from '../../../types';
import { EnvironmentType, getEnvironmentType, getEnvironmentTypeLabel } from '../environment-utils';

describe('utils#getEnvironmentType', () => {
  it('should identify environment type from tags', () => {
    expect(getEnvironmentType({ spec: { tags: ['foo', 'managed'] } } as EnvironmentKind)).toBe(
      EnvironmentType.managed,
    );
    expect(getEnvironmentType({ spec: { tags: ['foo', 'static'] } } as EnvironmentKind)).toBe(
      EnvironmentType.static,
    );

    expect(getEnvironmentType({} as EnvironmentKind)).toBe(EnvironmentType.default);
  });
});

describe('utils#getEnvironmentTypeLabel', () => {
  it('should convert type to label', () => {
    expect(getEnvironmentTypeLabel(EnvironmentType.default)).toBe('Default');
    expect(getEnvironmentTypeLabel(EnvironmentType.managed)).toBe('Self Managed');
    expect(getEnvironmentTypeLabel(EnvironmentType.static)).toBe('Static');
  });
});
