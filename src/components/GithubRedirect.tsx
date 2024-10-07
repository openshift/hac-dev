import * as React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { Bullseye, Flex, HelperText, HelperTextItem, Spinner } from '@patternfly/react-core';
import { PipelineRunLabel } from '../consts/pipelinerun';
import { useWorkspaceForNamespace } from '../hooks/useWorkspaceForNamespace';
import ErrorEmptyState from '../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../shared/utils/error/http-error';
import { PipelineRunKind } from '../types';
import { fetchPipelineRun } from '../utils/pipeline-utils';

const GithubRedirect = () => {
  const { pathname } = useLocation();
  const { ns, pipelineRun, task } = useParams();
  const workspace = useWorkspaceForNamespace(ns);
  const [application, setApplication] = React.useState<string>();
  const [error, setError] = React.useState();
  const isLogsTabSelected = pathname.includes('/logs');

  React.useEffect(() => {
    let unmounted = false;
    // Remove this logic in the new konflux-ui once we have a way to pass the workspace for API calls
    const fetchPipeline = async () => {
      try {
        const pr: PipelineRunKind = await fetchPipelineRun(
          workspace?.metadata?.name,
          ns,
          pipelineRun,
        );
        if (unmounted) return;
        setApplication(pr.metadata.labels[PipelineRunLabel.APPLICATION]);
      } catch (e) {
        if (unmounted) return;
        setError(e);
        setApplication(undefined);
      }
    };
    fetchPipeline();
    return () => {
      unmounted = true;
    };
  }, [ns, pipelineRun, workspace]);

  const navigateUrl = `/application-pipeline${
    workspace
      ? `/workspaces/${workspace.metadata.name}${
          application && !error
            ? `/applications/${application}${pipelineRun ? `/pipelineruns/${pipelineRun}` : ''}${
                isLogsTabSelected ? `/logs` : ''
              }${task ? `?task=${task}` : ''}`
            : ''
        }`
      : ''
  }`;

  const shouldRedirect = pipelineRun ? application && !error : true;

  if (error || (error && !application)) {
    return (
      <ErrorEmptyState
        httpError={error ? HttpError.fromCode((error as any)?.code) : undefined}
        title={`Unable to load pipeline run ${pipelineRun}`}
        body={
          error
            ? (error as any)?.message
            : `Could not find '${PipelineRunLabel.APPLICATION}' label in pipeline run`
        }
      />
    );
  }

  return (
    <>
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
                Redirecting {pipelineRun ? 'to pipeline run' : null}{' '}
                {isLogsTabSelected ? 'logs' : null}
                ...
              </HelperTextItem>
            </HelperText>
          </Flex>
        </Bullseye>
      )}
    </>
  );
};

export default GithubRedirect;
