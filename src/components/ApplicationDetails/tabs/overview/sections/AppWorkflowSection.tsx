import React from 'react';
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
import GraphErrorState from '../../../../topology/factories/GraphErrorState';
import { WorkflowGraph } from '../visualization';
import { useAppWorkflowData } from '../visualization/hooks/useAppWorkflowData';

import './AppWorkflowSection.scss';

type AppWorkflowSectionProps = {
  applicationName: string;
};

const AppWorkflowSection: React.FC<React.PropsWithChildren<AppWorkflowSectionProps>> = ({
  applicationName,
}) => {
  const [expanded, setExpanded] = useSearchParam('expanded', '');

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
                  release.
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
          </>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default AppWorkflowSection;
