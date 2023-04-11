import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants,
  Button,
  Bullseye,
  Spinner,
  Flex,
  FlexItem,
  ButtonVariant,
} from '@patternfly/react-core';
import { useSearchParam } from '../../../../../hooks/useSearchParam';
import { ComponentModel } from '../../../../../models';
import { useAccessReviewForModel } from '../../../../../utils/rbac';
import { useWorkspaceInfo } from '../../../../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../../../../ButtonWithAccessTooltip';
import GraphErrorState from '../../../../topology/factories/GraphErrorState';
import { WorkflowGraph } from '../visualization';
import { useAppWorkflowData } from '../visualization/hooks/useAppWorkflowData';

import './AppWorkflowSection.scss';
type AppWorkflowSectionProps = {
  applicationName: string;
};

const AppWorkflowSection: React.FC<AppWorkflowSectionProps> = ({ applicationName }) => {
  const [expanded, setExpanded] = useSearchParam('expanded', '');
  const { workspace } = useWorkspaceInfo();
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');

  const [workflowModel, loaded, errors] = useAppWorkflowData(applicationName, expanded === 'true');

  const toggleExpanded = () => {
    setExpanded(expanded ? '' : 'true');
  };

  return (
    <React.Fragment>
      <Grid hasGutter className="app-workflow">
        <GridItem>
          <TextContent>
            <Text component={TextVariants.h3}>Lifecycle</Text>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
              <FlexItem>
                <Text component={TextVariants.p}>
                  This is a visualization of your application pipeline, from source code through
                  test to deployments.
                </Text>
              </FlexItem>
              {loaded && errors.length === 0 && (
                <FlexItem>
                  <Button variant={ButtonVariant.link} isInline onClick={toggleExpanded}>
                    {expanded ? 'Collapse items' : 'Expand items'}
                  </Button>
                </FlexItem>
              )}
            </Flex>
          </TextContent>
        </GridItem>
        {!loaded ? (
          <Bullseye>
            <Spinner />
          </Bullseye>
        ) : (
          <>
            <GridItem>
              {errors.length > 0 ? (
                <GraphErrorState errors={errors} />
              ) : (
                <WorkflowGraph
                  nodes={workflowModel.nodes}
                  edges={workflowModel.edges}
                  expanded={expanded === 'true'}
                />
              )}
            </GridItem>
            <GridItem>
              <ButtonWithAccessTooltip
                variant="secondary"
                component={(props) => (
                  <Link
                    {...props}
                    to={`/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`}
                  />
                )}
                tooltip="You don't have access to add a component"
                isDisabled={!canCreateComponent}
                data-test="add-component"
                analytics={{
                  link_name: 'add-component',
                  link_location: 'lifecycle-visualization',
                  app_name: applicationName,
                  workspace,
                }}
              >
                Add component
              </ButtonWithAccessTooltip>
            </GridItem>
          </>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default AppWorkflowSection;
