import { DataState, testPipelineRuns } from '../../__data__/pipelinerun-data';
import { PipelineRunKind } from '../../types';
import {
  calculateDuration,
  getDuration,
  getPipelineRunData,
  getRandomChars,
} from '../pipeline-utils';

const samplePipelineRun = testPipelineRuns[DataState.SUCCEEDED];

describe('getDuration', () => {
  it('handles invalid values', () => {
    [0, -1, -9999].forEach((v) => expect(getDuration(v)).toBe('less than a second'));
  });

  it('returns correct durations in short format', () => {
    expect(getDuration(60 * 60 * 12)).toEqual('12 h');
    expect(getDuration(60)).toEqual('1 m');
    expect(getDuration(45)).toEqual('45 s');
  });
  it('returns correct durations in long format', () => {
    expect(getDuration(60 * 60 * 12, true)).toEqual('12 hours');
    expect(getDuration(60, true)).toEqual('1 minute');
    expect(getDuration(60 * 2, true)).toEqual('2 minutes');
    expect(getDuration(45, true)).toEqual('45 seconds');
  });
});

describe('calculateDuration', () => {
  it('should return definite duration', () => {
    let duration = calculateDuration('2020-05-22T11:57:53Z', '2020-05-22T11:57:57Z');
    expect(duration).toEqual('4 seconds');

    duration = calculateDuration('2020-05-22T11:57:53Z', '2020-05-22T12:02:20Z');
    expect(duration).toBe('4 minutes 27 seconds');

    duration = calculateDuration('2020-05-22T10:57:53Z', '2020-05-22T12:57:57Z');
    expect(duration).toBe('2 hours 4 seconds');
  });
});

describe('getRandomCharacters', () => {
  it('should return 6 digit random alphanumeric characters as default', () => {
    const randomOutput = getRandomChars();
    expect(randomOutput).toHaveLength(6);
  });

  it('should return 2 digit random alphanumeric characters', () => {
    const randomOutput = getRandomChars(2);
    expect(randomOutput).toHaveLength(2);
  });
});

describe('getPipelineRunData', () => {
  it('should return null', () => {
    expect(getPipelineRunData(null)).toBeNull();
  });

  it('should have a different name for the new pipelinerun created out of the old pipelinerun', () => {
    const runData = getPipelineRunData(samplePipelineRun);
    expect(runData.metadata.name).not.toBe(samplePipelineRun.metadata.name);
  });

  it('should not contain the last applied configuration for the new pipelinerun object', () => {
    const pipelineRunWithLastAppliedConf: PipelineRunKind = {
      ...samplePipelineRun,
      metadata: {
        ...samplePipelineRun.metadata,
        annotations: {
          ...samplePipelineRun.metadata.annotations,
          ['kubectl.kubernetes.io/last-applied-configuration']: `{
            apiVersion: 'v1',
            kind: 'PipelineRun',
          }`,
        },
      },
    };
    const runData = getPipelineRunData(pipelineRunWithLastAppliedConf);
    expect(runData.metadata['kubectl.kubernetes.io/last-applied-configuration']).not.toBeDefined();
  });

  it('should set generateName field when the option is passed', () => {
    const runData = getPipelineRunData(samplePipelineRun, { generateName: true });
    expect(runData.metadata.name).not.toBeDefined();
    expect(runData.metadata.generateName).toBe(`${samplePipelineRun.metadata.generateName}`);
  });

  it('should set metadata.name field when the generateName option is not passed', () => {
    const runData = getPipelineRunData(samplePipelineRun);
    expect(runData.metadata.generateName).not.toBeDefined();
    expect(runData.metadata.name).toBeDefined();
  });
});
