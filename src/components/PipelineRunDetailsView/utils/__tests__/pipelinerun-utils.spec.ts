import { PipelineRunLabel } from '../../../../consts/pipelinerun';
import { sampleBuildPipelines } from '../../../ApplicationDetails/tabs/overview/visualization/hooks/__data__/workflow-data';
import { getSourceUrl, stripQueryStringParams } from '../pipelinerun-utils';

describe('gitSourceUrl', () => {
  it('should return undefined if both the annotations are not available or for any invalid values', () => {
    const pipelineWithoutAnySource = {
      ...sampleBuildPipelines[0],
      metadata: {
        ...sampleBuildPipelines[0].metadata,
        annotations: {},
      },
    };
    expect(getSourceUrl(pipelineWithoutAnySource)).toBeUndefined();
    expect(getSourceUrl(null)).toBeUndefined();
    expect(getSourceUrl(undefined)).toBeUndefined();
  });

  it('should return a git repo url for advanced pipeline via pac annotations', () => {
    const advancedPipelineWithPAC = sampleBuildPipelines[0];
    expect(getSourceUrl(advancedPipelineWithPAC)).toBe(
      'https://github.com/karthikjeeyar/test-nodeapp',
    );
  });

  it('should return a git repo url for simple pipeline', () => {
    const simplePipeline = {
      ...sampleBuildPipelines[1],
    };
    expect(getSourceUrl(simplePipeline)).toBe('https://github.com/test/test-repo');
  });

  it('should remove any query string parameters from the url', () => {
    const simplePipeline = {
      ...sampleBuildPipelines[1],
      metadata: {
        ...sampleBuildPipelines[1].metadata,
        annotations: {
          [PipelineRunLabel.BUILD_SERVICE_REPO_ANNOTATION]:
            'https://github.com/test/test-repo?rev=1e0f5587bb0a4986071ddae9a2d59834c3cf8432',
        },
      },
    };
    expect(getSourceUrl(simplePipeline)).toBe('https://github.com/test/test-repo');
  });
});

describe('stripQueryStringParams', () => {
  it('should return undefined for invalid values', () => {
    expect(stripQueryStringParams(null)).toBeUndefined();
    expect(stripQueryStringParams(undefined)).toBeUndefined();
    expect(stripQueryStringParams('')).toBeUndefined();
  });

  it('should remove all the query string parameters the url', () => {
    expect(stripQueryStringParams('https://github.com/test/test-repo?foo=bar&bar=baz')).toBe(
      'https://github.com/test/test-repo',
    );
  });
});
