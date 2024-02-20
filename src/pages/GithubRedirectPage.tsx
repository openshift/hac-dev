import * as React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { Bullseye, Flex, HelperText, HelperTextItem, Spinner } from '@patternfly/react-core';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { usePipelineRun } from '../hooks/usePipelineRuns';
import { useWorkspaceForNamespace } from '../hooks/useWorkspaceForNamespace';
import ErrorEmptyState from '../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../shared/utils/error/http-error';

const GithubRedirectPage = () => {
  const { pathname } = useLocation();
  const { ns, pipelineRun, task } = useParams();
  const workspace = useWorkspaceForNamespace(ns);
  const [pr, loaded, error] = usePipelineRun(pipelineRun ? ns : null, pipelineRun ?? null);
  const application = loaded && !error ? pr.metadata.labels[PipelineRunLabel.APPLICATION] : null;
  const isLogsTabSelected = pathname.includes('/logs');

  const navigateUrl = `/application-pipeline${
    workspace
      ? `/workspaces/${workspace.metadata.name}${
          application
            ? `/applications/${application}${
                task ? `/taskruns/${task}` : pipelineRun ? `/pipelineruns/${pipelineRun}` : ''
              }${isLogsTabSelected ? `/logs` : ''}`
            : ''
        }`
      : ''
  }`;

  const shouldRedirect = pipelineRun ? loaded && !error : true;

  if (error || (loaded && !error && !application)) {
    return (
      <NamespacedPage>
        <ErrorEmptyState
          httpError={error ? HttpError.fromCode((error as any)?.code) : undefined}
          title={`Unable to load pipeline run ${pipelineRun}`}
          body={
            error
              ? (error as any)?.message
              : `Could not find '${PipelineRunLabel.APPLICATION}' label in pipeline run`
          }
        />
      </NamespacedPage>
    );
  }

  return (
    <NamespacedPage>
      {shouldRedirect ? (
        <Navigate to={navigateUrl} replace />
      ) : (
        <Bullseye>
          <Flex direction={{ default: 'column' }}>
            <Bullseye style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
              <Spinner size="xl" />
            </Bullseye>
            <HelperText>
              <HelperTextItem variant="indeterminate">
                Redirecting {task ? `to task run` : pipelineRun ? 'to pipeline run' : null}{' '}
                {isLogsTabSelected ? 'logs' : null}
                ...
              </HelperTextItem>
            </HelperText>
          </Flex>
        </Bullseye>
      )}
    </NamespacedPage>
  );
};

export default GithubRedirectPage;
