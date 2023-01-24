import { RunStatus } from '@patternfly/react-topology';
import { mockSnapshotsEnvironmentBindings } from '../../components/ApplicationDetails/tabs/overview/sections/__data__';
import { EnvironmentKind } from '../../types';
import { GitOpsDeploymentHealthStatus } from '../../types/gitops-deployment';
import {
  getComponentDeploymentRunStatus,
  getComponentDeploymentStatus,
  sortEnvironmentsBasedonParent,
} from '../environment-utils';

describe('environment-utils', () => {
  const a = {
    metadata: {
      name: 'a',
    },
    spec: {},
  } as EnvironmentKind;
  const b = {
    metadata: {
      name: 'b',
    },
    spec: {
      parentEnvironment: 'a',
    },
  } as EnvironmentKind;
  const c = {
    metadata: {
      name: 'c',
    },
    spec: {
      parentEnvironment: 'b',
    },
  } as EnvironmentKind;

  const ba = {
    metadata: {
      name: 'ba',
    },
    spec: {
      parentEnvironment: 'a',
    },
  } as EnvironmentKind;

  const bb = {
    metadata: {
      name: 'bb',
    },
    spec: {
      parentEnvironment: 'a',
    },
  } as EnvironmentKind;

  const bc = {
    metadata: {
      name: 'bc',
    },
    spec: {
      parentEnvironment: 'a',
    },
  } as EnvironmentKind;

  const cb = {
    metadata: {
      name: 'cb',
    },
    spec: {
      parentEnvironment: 'b',
    },
  } as EnvironmentKind;

  const ac = {
    metadata: {
      name: 'ac',
    },
    spec: {
      parentEnvironment: 'cb',
    },
  } as EnvironmentKind;

  it('should sort environments', () => {
    expect(sortEnvironmentsBasedonParent([c, b, a])).toEqual([a, b, c]);
    expect(sortEnvironmentsBasedonParent([b, c, a])).toEqual([a, b, c]);
    expect(sortEnvironmentsBasedonParent([c, a, b])).toEqual([a, b, c]);
    expect(sortEnvironmentsBasedonParent([a, b, c])).toEqual([a, b, c]);
  });

  it('should sort environments alphabetically as well', () => {
    expect(sortEnvironmentsBasedonParent([cb, c, ba, b, bc, bb, a])).toEqual([
      a,
      b,
      ba,
      bb,
      bc,
      c,
      cb,
    ]);

    expect(sortEnvironmentsBasedonParent([ba, b, bc, bb, a, cb, c])).toEqual([
      a,
      b,
      ba,
      bb,
      bc,
      c,
      cb,
    ]);
    expect(sortEnvironmentsBasedonParent([ba, b, bc, bb, a, cb, c])).toEqual([
      a,
      b,
      ba,
      bb,
      bc,
      c,
      cb,
    ]);

    expect(sortEnvironmentsBasedonParent([ac, ba, b, bc, bb, a, cb, c])).toEqual([
      a,
      b,
      ba,
      bb,
      bc,
      c,
      cb,
      ac,
    ]);
  });

  describe('getComponentDeploymentStatus', () => {
    it('should return Missing status for SEB without status', () => {
      expect(
        getComponentDeploymentStatus({ ...mockSnapshotsEnvironmentBindings[0], status: undefined }),
      ).toBe(GitOpsDeploymentHealthStatus.Missing);
    });

    it('should return Progressing status for SEB with progressing status', () => {
      expect(
        getComponentDeploymentStatus({
          ...mockSnapshotsEnvironmentBindings[1],
        }),
      ).toBe(GitOpsDeploymentHealthStatus.Progressing);
    });

    it('should return Healthy status', () => {
      expect(getComponentDeploymentStatus(mockSnapshotsEnvironmentBindings[0])).toBe(
        GitOpsDeploymentHealthStatus.Healthy,
      );
    });

    it('should return Degraded status', () => {
      expect(getComponentDeploymentStatus(mockSnapshotsEnvironmentBindings[2])).toBe(
        GitOpsDeploymentHealthStatus.Degraded,
      );
    });
  });

  describe('getComponentDeploymentRunStatus', () => {
    it('should return Pending status for SEB without status', () => {
      const missingApplication = { ...mockSnapshotsEnvironmentBindings[0], status: undefined };
      expect(getComponentDeploymentRunStatus(missingApplication)).toBe(RunStatus.Pending);
    });

    it('should return Running status for progressing application', () => {
      const progressingApplication = mockSnapshotsEnvironmentBindings[1];
      expect(getComponentDeploymentRunStatus(progressingApplication)).toBe(RunStatus.Running);
    });

    it('should return Succeeded status for healthy application', () => {
      const healthyApplication = mockSnapshotsEnvironmentBindings[0];
      expect(getComponentDeploymentRunStatus(healthyApplication)).toBe(RunStatus.Succeeded);
    });

    it('should return Succeeded status for healthy application', () => {
      const degradedApplication = mockSnapshotsEnvironmentBindings[2];
      expect(getComponentDeploymentRunStatus(degradedApplication)).toBe(RunStatus.Failed);
    });
  });
});
