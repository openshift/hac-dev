import { ComponentRelationNudgeType } from '../type';
import { componentRelationValidationSchema, transformNudgeData } from '../utils';

describe('transformNudgeData', () => {
  it('should transform data', () => {
    expect(
      transformNudgeData([
        { source: 'abcd', nudgeType: ComponentRelationNudgeType.NUDGES, target: ['b', 'c'] },
      ]),
    ).toEqual({ abcd: ['b', 'c'] });
    expect(
      transformNudgeData([
        { source: 'abcd', nudgeType: ComponentRelationNudgeType.NUDGES, target: ['b', 'c'] },
        { source: 'abcd', nudgeType: ComponentRelationNudgeType.NUDGED_BY, target: ['b', 'c'] },
      ]),
    ).toEqual({ abcd: ['b', 'c'], b: ['abcd'], c: ['abcd'] });
    expect(
      transformNudgeData([
        { source: 'abcd', nudgeType: ComponentRelationNudgeType.NUDGES, target: ['b', 'c'] },
        { source: 'abcd', nudgeType: ComponentRelationNudgeType.NUDGED_BY, target: ['b', 'c'] },
        { source: 'b', nudgeType: ComponentRelationNudgeType.NUDGED_BY, target: ['abcd', 'c'] },
      ]),
    ).toEqual({ abcd: ['b', 'c'], b: ['abcd'], c: ['abcd', 'b'] });
    expect(
      transformNudgeData([
        { source: 'abcd', nudgeType: ComponentRelationNudgeType.NUDGES, target: ['b', 'c'] },
        { source: 'abcd', nudgeType: ComponentRelationNudgeType.NUDGED_BY, target: ['b', 'c'] },
        { source: 'b', nudgeType: ComponentRelationNudgeType.NUDGED_BY, target: ['abcd', 'c'] },
        { source: 'c', nudgeType: ComponentRelationNudgeType.NUDGES, target: ['abcd', 'b'] },
      ]),
    ).toEqual({ abcd: ['b', 'c'], b: ['abcd'], c: ['abcd', 'b'] });
  });
});

describe('componentRelationValidationSchema', () => {
  it('should validate yup schema', async () => {
    const values = {
      relations: [{ source: 'adf', nudgeType: ComponentRelationNudgeType.NUDGES, target: [] }],
    };
    await expect(componentRelationValidationSchema.validate(values)).resolves.toBe(values);
    await expect(
      componentRelationValidationSchema.validate({
        relations: [{ source: '', nudgeType: ComponentRelationNudgeType.NUDGES, target: [] }],
      }),
    ).rejects.toThrowError();
    await expect(
      componentRelationValidationSchema.validate({
        relations: [
          { source: 'adf', nudgeType: ComponentRelationNudgeType.NUDGES, target: ['a'] },
          { source: 'adf', nudgeType: ComponentRelationNudgeType.NUDGES, target: ['f'] },
        ],
      }),
    ).rejects.toThrow('2 errors occurred');
  });
});
