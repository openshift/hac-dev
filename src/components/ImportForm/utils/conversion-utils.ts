const unitTypes = {
  memory: {
    units: ['i', 'Ki', 'Mi', 'Gi', 'Ti'],
    divisor: 1024,
  },
  cpu: {
    units: ['millicores', 'cores'],
    divisor: 1000,
  },
};

const getUnitType = (initialUnit: string): string | undefined => {
  let matchedUnit;
  Object.keys(unitTypes).forEach((unitType) => {
    if (matchedUnit) return;
    if (unitTypes[unitType].units.findIndex((k) => k === initialUnit) >= 0) {
      matchedUnit = unitType;
    }
  });
  return matchedUnit;
};

export const convertUnitValueToBaseValue = (
  value: string | number,
  initialUnit: string,
): { value: number; unit: string } => {
  const unitType = getUnitType(initialUnit);
  let value_ = Number(value);
  // check if initial Unit is not matched with available types
  if (!unitType) {
    return { value: value_, unit: initialUnit };
  }

  const { units, divisor } = unitTypes[unitType];
  let units_ = units.slice().reverse();

  // get the numeric value & prepare unit array for conversion
  units_ = units_.slice(units_.findIndex((unit) => unit === initialUnit));

  let unit = units_.shift();
  while (units_.length > 0) {
    value_ = value_ * divisor;
    unit = units_.shift();
  }

  return { value: value_, unit };
};

export const convertBaseValueToUnits = (
  value: number,
  preferredUnit: string,
): { value: number; unit: string } => {
  const unitType = getUnitType(preferredUnit);
  const { units, divisor } = unitTypes[unitType] || {};

  if (!units) {
    return {
      value,
      unit: preferredUnit,
    };
  }

  const units_ = units.slice();
  if (preferredUnit || preferredUnit === '') {
    const unitIndex = units_.indexOf(preferredUnit);
    if (unitIndex !== -1) {
      return {
        value: value / divisor ** unitIndex,
        unit: preferredUnit,
      };
    }
  }

  let unit = units_.shift();
  while (value >= divisor && units_.length > 0) {
    value = value / divisor;
    unit = units_.shift();
  }
  return { value, unit };
};
