import * as React from 'react';
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import yamlParser from 'js-yaml';
import { useLatestSuccessfulBuildPipelineRunForComponent } from '../../../../hooks/usePipelineRuns';
import ExternalLink from '../../../../shared/components/links/ExternalLink';
import { ComponentKind } from '../../../../types';
import { getPipelineRunStatusResults } from '../../../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import GitRepoLink from '../../../GitLink/GitRepoLink';

type ComponentDetailsProps = {
  component: ComponentKind;
};

const RESULT_NAME = 'IMAGE_URL';

const ComponentDetails: React.FC<React.PropsWithChildren<ComponentDetailsProps>> = ({
  component,
}) => {
  const { namespace } = useWorkspaceInfo();
  const [pipelineRun, pipelineRunLoaded, error] = useLatestSuccessfulBuildPipelineRunForComponent(
    namespace,
    component.metadata.name,
  );
  const results = !error && pipelineRunLoaded ? getPipelineRunStatusResults(pipelineRun) : null;
  const latestImageURL = results?.find((result) => result.name === RESULT_NAME);
  const componentImageURL = latestImageURL?.value ?? component.spec.containerImage;

  const runTime = React.useMemo(() => {
    try {
      const loadedYaml = yamlParser?.load(component.status?.devfile) as {
        metadata: { projectType: string; displayName: string; name: string };
      };
      return (
        loadedYaml?.metadata.projectType ||
        loadedYaml?.metadata.displayName ||
        loadedYaml?.metadata.name ||
        'N/A'
      );
    } catch {
      return 'N/A';
    }
  }, [component]);

  return (
    <Flex direction={{ default: 'row' }}>
      {component.spec.source?.git && (
        <FlexItem style={{ flex: 1 }}>
          <DescriptionList
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>Source code</DescriptionListTerm>
              <DescriptionListDescription>
                <GitRepoLink
                  url={component.spec.source?.git?.url}
                  revision={component.spec.source?.git?.revision}
                  context={component.spec.source?.git?.context}
                />
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </FlexItem>
      )}
      {componentImageURL && (
        <FlexItem style={{ flex: 1 }}>
          <DescriptionList
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>Latest image</DescriptionListTerm>
              <DescriptionListDescription>
                <ExternalLink
                  href={
                    componentImageURL.startsWith('http')
                      ? componentImageURL
                      : `https://${componentImageURL}`
                  }
                  text={componentImageURL}
                />
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </FlexItem>
      )}
      <FlexItem style={{ flex: 1 }}>
        <DescriptionList
          data-test="component-details-2"
          columnModifier={{
            default: '1Col',
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Runtime</DescriptionListTerm>
            <DescriptionListDescription>{runTime}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </FlexItem>
    </Flex>
  );
};

export default ComponentDetails;
