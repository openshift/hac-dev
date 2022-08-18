import { EnvironmentKind } from '../../../../types';
import { EnvironmentType, getEnvironmentType, getEnvironmentTypeLabel } from '../utils';

describe('utils#getEnvironmentType', () => {
  it('should identify environment type from tags', () => {
    expect(getEnvironmentType({ spec: { tags: ['foo', 'managed'] } } as EnvironmentKind)).toBe(
      EnvironmentType.managed,
    );
    expect(getEnvironmentType({ spec: { tags: ['foo', 'static'] } } as EnvironmentKind)).toBe(
      EnvironmentType.static,
    );
    expect(getEnvironmentType({ spec: { tags: ['foo', 'ephemeral'] } } as EnvironmentKind)).toBe(
      EnvironmentType.ephemeral,
    );
    expect(getEnvironmentType({} as EnvironmentKind)).toBe(EnvironmentType.static);
  });
});

describe('utils#getEnvironmentTypeLabel', () => {
  it('should convert type to label', () => {
    expect(getEnvironmentTypeLabel(EnvironmentType.ephemeral)).toBe('Ephemeral');
    expect(getEnvironmentTypeLabel(EnvironmentType.managed)).toBe('Managed');
    expect(getEnvironmentTypeLabel(EnvironmentType.static)).toBe('Static');
  });
});
