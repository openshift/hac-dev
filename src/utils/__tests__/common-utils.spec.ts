import { K8sResourceCommon } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sResourceCondition } from '../../types';
import { getConditionForResource } from '../common-utils';

describe('common-utils', () => {
  describe('getConditionForResource', () => {
    const resource: K8sResourceCommon = {
      kind: '',
      apiVersion: '',
      metadata: {},
      spec: {},
      status: {},
    };

    it('should return created ok condition', () => {
      const conditionsMockData: K8sResourceCondition[] = [
        {
          type: 'Created',
          reason: 'OK',
          message: 'Success',
          status: 'False',
        },
      ];
      resource.status.conditions = conditionsMockData;
      expect(getConditionForResource(resource)).toEqual({
        type: 'Created',
        reason: 'OK',
        message: 'Success',
        status: 'False',
      });
    });

    it('should return created error condition', () => {
      const conditionsMockData = [
        {
          type: 'Created',
          reason: 'OK',
          message: 'Success',
          status: 'False',
        },
        {
          type: 'Created',
          reason: 'Error',
          message: 'error',
          status: 'False',
        },
      ];
      resource.status.conditions = conditionsMockData;
      expect(getConditionForResource(resource)).toEqual({
        type: 'Created',
        reason: 'Error',
        message: 'error',
        status: 'False',
      });
    });

    it('shoudl return updated ok status', () => {
      const conditionsMockData = [
        {
          type: 'Created',
          reason: 'OK',
          message: 'Success',
          status: 'False',
        },
        {
          type: 'Updated',
          reason: 'OK',
          message: 'success',
          status: 'False',
        },
      ];
      resource.status.conditions = conditionsMockData;
      expect(getConditionForResource(resource)).toEqual({
        type: 'Updated',
        reason: 'OK',
        message: 'success',
        status: 'False',
      });
    });

    it('should return updated error status', () => {
      const conditionsMockData = [
        {
          type: 'Created',
          reason: 'OK',
          message: 'Success',
          status: 'False',
        },
        {
          type: 'Updated',
          reason: 'OK',
          message: 'success',
          status: 'False',
        },
        {
          type: 'Updated',
          reason: 'Error',
          message: 'Error',
          status: 'False',
        },
      ];
      resource.status.conditions = conditionsMockData;
      expect(getConditionForResource(resource)).toEqual({
        type: 'Updated',
        reason: 'Error',
        message: 'Error',
        status: 'False',
      });
    });

    it('should return undefined incase reason doesnt match', () => {
      const conditionsMockData = [
        {
          type: 'Created',
          reason: 'OK',
          message: 'Success',
          status: 'False',
        },
        {
          type: 'Updated',
          reason: 'Ready',
          message: 'Error',
          status: 'False',
        },
      ];
      resource.status.conditions = conditionsMockData;
      expect(getConditionForResource(resource)).toEqual(undefined);
      resource.status.conditions = [];
      expect(getConditionForResource(resource)).toEqual(undefined);
    });
  });
});
