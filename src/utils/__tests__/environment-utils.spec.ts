import { EnvironmentKind } from '../../types';
import { sortEnvironmentsBasedonParent } from '../environment-utils';

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
});
