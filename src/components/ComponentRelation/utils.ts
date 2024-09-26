import { k8sPatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { differenceBy, union } from 'lodash-es';
import * as yup from 'yup';
import { ComponentModel } from '../../models';
import { NudgeStats } from '../../types';
import {
  ComponentRelationFormikValue,
  ComponentRelationNudgeType,
  ComponentRelationValue,
} from './type';

export const DUPLICATE_RELATONSHIP = 'duplicate-component-relationship';

export const componentRelationValidationSchema = yup.mixed().test(
  (values: ComponentRelationFormikValue) =>
    yup
      .object()
      .shape({
        relations: yup
          .array()
          .of(
            yup
              .object()
              .shape({
                source: yup.string().required(),

                nudgeType: yup.string().required(),
                target: yup.array().of(yup.string()).required().min(0),
              })
              .test('duplicate-relation-test', DUPLICATE_RELATONSHIP, (value) => {
                const filteredValue = values.relations.filter(
                  (val) => val.source === value.source && val.nudgeType === value.nudgeType,
                );
                return filteredValue.length < 2;
              }),
          )
          .required()
          .min(1),
      })
      .validate(values, { abortEarly: false }) as any,
);

export const transformNudgeData = (data: ComponentRelationValue[]): { [key: string]: string[] } => {
  return data.reduce((acc, { source, nudgeType, target }) => {
    if (!source) return acc;
    if (nudgeType === ComponentRelationNudgeType.NUDGES) {
      acc[source] = acc[source] ? union(acc[source], target) : target;
      return acc;
    }
    target.length > 0 &&
      target.forEach((t) => {
        acc[t] = acc[t] ? union(acc[t], [source]) : [source];
      });
    return acc;
  }, {});
};

export const computeNudgeDataChanges = (
  initialValues: ComponentRelationValue[],
  values: ComponentRelationValue[],
): ComponentRelationValue[] => {
  // Find the missing relation and set the target to [] to remove it
  const removedSources = differenceBy(initialValues, values, 'source').map((val) => ({
    ...val,
    target: [],
  }));
  return [...values, ...removedSources];
};

export const updateNudgeDependencies = async (
  values: ComponentRelationValue[],
  initialValues: ComponentRelationValue[],
  namespace: string,
  dryRun?: boolean,
) => {
  const valueChanges = computeNudgeDataChanges(initialValues, values);
  const transformedData = transformNudgeData(valueChanges);
  const data = [];
  for (const [componentName, nudgeData] of Object.entries(transformedData)) {
    const result = await k8sPatchResource({
      model: ComponentModel,
      queryOptions: {
        name: componentName,
        ns: namespace,
        ...(dryRun && { queryParams: { dryRun: 'All' } }),
      },
      patches: [
        {
          op: 'replace',
          path: `/spec/${NudgeStats.NUDGES}`,
          value: nudgeData,
        },
      ],
    });
    data.push(result);
  }
  return data;
};
