import { EnvironmentKind } from '../../../../../../../types';
import { sampleBuildPipelines, sampleEnvironments } from '../../hooks/__data__/workflow-data';
import {
  addPrefixFromResourceName,
  appendPrefixToResources,
  getLatestResource,
  getMaxName,
  getNodeWidth,
  getTextWidth,
  removePrefixFromResourceName,
} from '../visualization-utils';

describe('getMaxName', () => {
  test('should return the max length resources', () => {
    expect(getMaxName([])).toBe(null);
    expect(getMaxName(undefined)).toBe(null);
    expect(getMaxName(null)).toBe(null);

    const comp1 = {
      ...sampleEnvironments[0],
      metadata: {
        name: 'one',
      },
    };
    const comp2 = {
      ...sampleEnvironments[0],
      metadata: {
        name: 'two',
      },
    };
    const comp3 = {
      ...sampleEnvironments[0],
      metadata: {
        name: 'three',
      },
    };

    expect(getMaxName([comp1, comp2, comp3])).toBe('three');
  });
});

describe('getNodeWidth', () => {
  test('should return the max length resources', () => {
    const createElement = document.createElement.bind(document);
    document.createElement = (tagName) => {
      if (tagName === 'canvas') {
        return {
          getContext: () => null,
        };
      }
      return createElement(tagName);
    };
    const plainWidth = getNodeWidth('test');
    const statusWidth = getNodeWidth('test', 'danger');
    const badgedWidth = getNodeWidth('test', 'danger', 2);
    expect(plainWidth).toBeGreaterThan(0);
    expect(statusWidth).toBeGreaterThan(plainWidth);
    expect(badgedWidth).toBeGreaterThan(statusWidth);
  });
});

describe('getTextWidth', () => {
  test('should return the default value if the text is empty or null', () => {
    expect(getTextWidth('')).toBe(0);
    expect(getTextWidth(null)).toBe(0);
  });

  test('should return the estimated width when there is no context', () => {
    expect(getTextWidth('text')).toBe(32);
  });
});

describe('getLatestResource', () => {
  test('should return default value for invalid resources', () => {
    expect(getLatestResource(null)).toBeUndefined();
    expect(getLatestResource([])).toBeUndefined();
  });

  test('should return the latest resource', () => {
    expect(getLatestResource(sampleBuildPipelines)).toBe(sampleBuildPipelines[0]);
  });
});

describe('addPrefixFromResourceName', () => {
  test('should return the name with give prefix ', () => {
    expect(addPrefixFromResourceName('test', 'resource-one')).toBe('test#resource-one');
    expect(addPrefixFromResourceName('test-prefix', 'resource-two')).toBe(
      'test-prefix#resource-two',
    );
  });
});

describe('appendPrefixToResources', () => {
  test('should modify all the resources with given prefix ', () => {
    const resources = appendPrefixToResources(sampleBuildPipelines, 'test');
    expect(resources[0].metadata.name).toBe(`test#${sampleBuildPipelines[0].metadata.name}`);
    expect(resources[1].metadata.name).toBe(`test#${sampleBuildPipelines[1].metadata.name}`);
  });

  test('should modify all the resources and its additional path with given prefix ', () => {
    const resources = appendPrefixToResources(
      sampleEnvironments,
      'envprefix',
      'spec.parentEnvironment',
    ) as EnvironmentKind[];
    expect(resources[2].metadata.name).toBe(`envprefix#${sampleEnvironments[2].metadata.name}`);
    expect(resources[2].spec.parentEnvironment).toBe(
      `envprefix#${sampleEnvironments[2].spec.parentEnvironment}`,
    );
  });

  test('should not update the additional path with given prefix when the path is invalid or not defined', () => {
    const resources = appendPrefixToResources(
      sampleEnvironments,
      'envprefix',
      'spec.parentEnvironment',
    ) as EnvironmentKind[];

    const envWithoutParent = resources.find((env) => env.spec.parentEnvironment === undefined);
    expect(envWithoutParent.metadata.name).toBe(`envprefix#${sampleEnvironments[0].metadata.name}`);
    expect(envWithoutParent.spec.parentEnvironment).toBeUndefined;
  });
});

describe('removePrefixFromResourceName', () => {
  test('should return the name without prefix', () => {
    expect(removePrefixFromResourceName('prefix#resource-one')).toBe('resource-one');
  });

  test('should remove multiple prefix', () => {
    expect(removePrefixFromResourceName('test#prefix#resource-two')).toBe('resource-two');
  });
  test('should return the input if it does not contain prefix', () => {
    expect(removePrefixFromResourceName('text')).toBe('text');
  });
});
