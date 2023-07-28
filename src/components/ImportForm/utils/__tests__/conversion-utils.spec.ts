import { convertBaseValueToUnits, convertUnitValueToBaseValue } from '../conversion-utils';

describe('converUnitValuetoBaseValue', () => {
  it('should return the input without any coversion for invalid unit ', () => {
    expect(convertUnitValueToBaseValue('1000', 'TKi')).toEqual({ value: 1000, unit: 'TKi' });
    expect(convertUnitValueToBaseValue('1', 'Xyz')).toEqual({ value: 1, unit: 'Xyz' });
  });

  it('should convert the value to its base value', () => {
    // memory unit conversion
    expect(convertUnitValueToBaseValue('1000', 'Ki')).toEqual({ value: 1024000, unit: 'i' });
    expect(convertUnitValueToBaseValue('10', 'Mi')).toEqual({ value: 10485760, unit: 'i' });
    expect(convertUnitValueToBaseValue('1', 'Gi')).toEqual({ value: 1073741824, unit: 'i' });
    expect(convertUnitValueToBaseValue('1', 'Ti')).toEqual({ value: 1099511627776, unit: 'i' });

    // cpu unit conversion
    expect(convertUnitValueToBaseValue('10', 'millicores')).toEqual({
      value: 10,
      unit: 'millicores',
    });
    expect(convertUnitValueToBaseValue('10', 'cores')).toEqual({
      value: 10000,
      unit: 'millicores',
    });
  });
});

describe('convertBaseValueToUnits', () => {
  it('should return the input without any coversion for invalid unit ', () => {
    expect(convertBaseValueToUnits(1000, 'TKi')).toEqual({ value: 1000, unit: 'TKi' });
    expect(convertBaseValueToUnits(1, 'Xyz')).toEqual({ value: 1, unit: 'Xyz' });
  });

  it('should convert the base value to the preffered unit value', () => {
    const baseValue = convertUnitValueToBaseValue('1', 'Gi').value;
    expect(convertBaseValueToUnits(baseValue, 'Ti')).toEqual({ value: 0.0009765625, unit: 'Ti' });
    expect(convertBaseValueToUnits(baseValue, 'Gi')).toEqual({ value: 1, unit: 'Gi' });
    expect(convertBaseValueToUnits(baseValue, 'Mi')).toEqual({ value: 1024, unit: 'Mi' });
    expect(convertBaseValueToUnits(baseValue, 'Ki')).toEqual({ value: 1048576, unit: 'Ki' });
  });
});
