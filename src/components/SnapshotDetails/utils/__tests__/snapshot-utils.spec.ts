import '@testing-library/jest-dom';
import { MockSnapshots } from '../../../Commits/CommitDetails/visualization/__data__/MockCommitWorkflowData';
import { getEnvironmentProvisionError } from '../snapshot-utils';

describe('snapshot-utils', () => {
  it('should return null if no status', () => {
    const result = getEnvironmentProvisionError(MockSnapshots[2]);
    expect(result).toBeNull();
  });

  it('should return empty array if no EnvProvisionError', () => {
    const result = getEnvironmentProvisionError(MockSnapshots[3]);
    expect(result).toEqual([]);
  });

  it('should return formatted error status', () => {
    const result = getEnvironmentProvisionError(MockSnapshots[1]);
    expect(result.length).toBe(1);
    expect(result[0].scenario).toBe('app-sample-go-basic-enterprise-contract');
  });

  it('should return multiple errors', () => {
    const result = getEnvironmentProvisionError(MockSnapshots[0]);
    expect(result.length).toBe(2);
    expect(result[0].details).toBe('could not find deployment');
    expect(result[1].details).toContain('Failed to find deploymentTargetClass');
  });

  it('should sort errors by lastUpdateTime', () => {
    const result = getEnvironmentProvisionError(MockSnapshots[0]);
    expect(result.length).toBe(2);
    expect(result[0].scenario).toBe('scn 2');
    expect(result[1].scenario).toBe('app-sample-go-basic-enterprise-contract');
    expect(result[0].lastUpdateTime).toBe('2023-09-20T16:00:38.969982048Z');
    expect(result[1].lastUpdateTime).toBe('2023-09-19T16:00:38.969982048Z');
  });
});
