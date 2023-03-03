import { PipelineRunLabel } from '../../../consts/pipelinerun';
import { PipelineRunKind } from '../../../types';

export const stripQueryStringParams = (url: string) => {
  if (!url) return undefined;

  const { origin, pathname } = new URL(url);
  return `${origin}${pathname}`;
};

export const getSourceUrl = (pipelineRun: PipelineRunKind): string => {
  if (!pipelineRun) {
    return undefined;
  }

  const repoFromBuildServiceAnnotation =
    pipelineRun.metadata?.annotations?.[PipelineRunLabel.BUILD_SERVICE_REPO_ANNOTATION];
  const repoFromPACAnnotation =
    pipelineRun.metadata?.annotations?.[PipelineRunLabel.COMMIT_FULL_REPO_URL_ANNOTATION];

  return stripQueryStringParams(repoFromPACAnnotation || repoFromBuildServiceAnnotation);
};
