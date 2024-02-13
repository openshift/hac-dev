import { k8sGetResource, k8sUpdateResource } from '@openshift/dynamic-plugin-sdk-utils';
import { union } from 'lodash-es';
import * as yup from 'yup';
import { ComponentModel } from '../../models';
import { ComponentKind, NudgeStats } from '../../types';
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

const mergeNudgeDataIntoResource = (resource: ComponentKind, nudgeData: string[]) => {
  return {
    ...resource,
    spec: {
      ...resource.spec,
      [NudgeStats.NUDGES]: nudgeData,
    },
  };
};

export const updateNudgeDependencies = async (
  values: ComponentRelationValue[],
  namespace: string,
  dryRun?: boolean,
) => {
  const transformedData = transformNudgeData(values);
  const data = [];
  for (const [componentName, nudgeData] of Object.entries(transformedData)) {
    // fetch new copy because component dependency might have been updated for this component
    const component = await k8sGetResource<ComponentKind>({
      model: ComponentModel,
      queryOptions: { name: componentName, ns: namespace },
    });
    const resource = mergeNudgeDataIntoResource(component, nudgeData);
    const result = await k8sUpdateResource({
      model: ComponentModel,
      resource,
      queryOptions: {
        name: component.metadata.name,
        ns: component.metadata.namespace,
        ...(dryRun && { queryParams: { dryRun: 'All' } }),
      },
    });
    data.push(result);
  }
  return data;
};
