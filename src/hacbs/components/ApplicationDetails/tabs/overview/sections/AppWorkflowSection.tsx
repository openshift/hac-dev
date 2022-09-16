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
} from '@patternfly/react-core';
import { WorkflowGraph } from '../visualization';
import { useAppWorkflowData } from '../visualization/hooks/useAppWorkflowData';
import { getTopologyNodesEdges } from '../visualization/utils/visualization-utils';

import './AppWorkflowSection.scss';

type AppWorkflowSectionProps = {
  applicationName: string;
};

const AppWorkflowSection: React.FC<AppWorkflowSectionProps> = ({ applicationName }) => {
  const [workflowNodes, loaded] = useAppWorkflowData(applicationName);
  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }
  const { nodes, edges } = getTopologyNodesEdges(workflowNodes);

  return (
    <Grid hasGutter className="hacbs-app-workflow">
      <GridItem>
        <TextContent>
          <Text component={TextVariants.h3}>Appplication workflow</Text>
          <Text component={TextVariants.p}>Manage your CI/CD workflow</Text>
        </TextContent>
      </GridItem>
      <GridItem>
        <WorkflowGraph nodes={nodes} edges={edges} />
      </GridItem>
      <GridItem>
        <Button
          variant="secondary"
          component={(props) => (
            <Link {...props} to={`/app-studio/import?application=${applicationName}`} />
          )}
          data-test="add-component"
        >
          Add component
        </Button>
      </GridItem>
    </Grid>
  );
};

export default AppWorkflowSection;
