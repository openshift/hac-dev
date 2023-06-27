import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Title,
} from '@patternfly/react-core';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { IntegrationTestScenarioKind } from '../../../types/coreBuildService';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import MetadataList from '../../PipelineRunDetailsView/MetadataList';
import { IntegrationTestLabels } from '../IntegrationTestForm/types';
import { getLabelForParam, getURLForParam } from '../IntegrationTestForm/utils/create-utils';

interface IntegrationTestOverviewTabProps {
  integrationTest: IntegrationTestScenarioKind;
}

const IntegrationTestOverviewTab: React.FC<IntegrationTestOverviewTabProps> = ({
  integrationTest,
}) => {
  const { workspace } = useWorkspaceInfo();
  const optionalReleaseLabel =
    integrationTest.metadata.labels?.[IntegrationTestLabels.OPTIONAL] === 'true';

  return (
    <>
      <Title headingLevel="h4" className="pf-c-title pf-u-mt-lg pf-u-mb-lg" size="lg">
        Integration test details
      </Title>
      <Flex>
        <Flex flex={{ default: 'flex_3' }}>
          <FlexItem>
            <DescriptionList
              data-test="integration-test-details"
              columnModifier={{
                default: '1Col',
              }}
            >
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>
                  {integrationTest.metadata.name ?? '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Namespace</DescriptionListTerm>
                <DescriptionListDescription>
                  {integrationTest.metadata.namespace ?? '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Labels</DescriptionListTerm>
                <DescriptionListDescription>
                  <MetadataList metadata={integrationTest.metadata.labels} />
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Annotations</DescriptionListTerm>
                <DescriptionListDescription>
                  <MetadataList metadata={integrationTest.metadata.annotations} />
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Created at</DescriptionListTerm>
                <DescriptionListDescription>
                  <Timestamp timestamp={integrationTest.metadata.creationTimestamp ?? '-'} />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </FlexItem>
        </Flex>

        <Flex flex={{ default: 'flex_3' }}>
          <FlexItem>
            <DescriptionList
              data-test="integration-test-details"
              columnModifier={{
                default: '1Col',
              }}
            >
              {integrationTest.spec.resolverRef && (
                <>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Type</DescriptionListTerm>
                    <DescriptionListDescription>
                      {integrationTest.spec.resolverRef.resolver}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  {integrationTest.spec.resolverRef.params.map((param) => {
                    const paramLink = getURLForParam(
                      integrationTest.spec.resolverRef.params,
                      param.name,
                    );
                    return (
                      <DescriptionListGroup key={param.name}>
                        <DescriptionListTerm>{getLabelForParam(param.name)}</DescriptionListTerm>
                        <DescriptionListDescription>
                          {paramLink ? (
                            <ExternalLink href={paramLink}>{param.value}</ExternalLink>
                          ) : (
                            param.value
                          )}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    );
                  })}
                </>
              )}
              <DescriptionListGroup>
                <DescriptionListTerm>Optional for release</DescriptionListTerm>
                <DescriptionListDescription>
                  {optionalReleaseLabel ? 'Optional' : 'Mandatory'}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Application</DescriptionListTerm>
                <DescriptionListDescription>
                  <Link
                    to={`/application-pipeline/workspaces/${workspace}/applications/${integrationTest.spec.application}`}
                  >
                    {integrationTest.spec.application}
                  </Link>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </FlexItem>
        </Flex>
      </Flex>
    </>
  );
};

export default IntegrationTestOverviewTab;
