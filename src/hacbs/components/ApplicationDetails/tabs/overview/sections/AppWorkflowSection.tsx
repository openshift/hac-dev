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
import ApplicationModal from '../../../ApplicationModal';
import { WorkflowGraph } from '../visualization';
import { useAppWorkflowData } from '../visualization/hooks/useAppWorkflowData';
import { getTopologyNodesEdges } from '../visualization/utils/visualization-utils';

import './AppWorkflowSection.scss';

type AppWorkflowSectionProps = {
  applicationName: string;
};

const AppWorkflowSection: React.FC<AppWorkflowSectionProps> = ({ applicationName }) => {
  const [showApplicationModal, setShowApplicationModal] = React.useState<boolean>(false);

  const openModal = () => {
    setShowApplicationModal(true);
  };

  const closeModal = () => {
    setShowApplicationModal(false);
  };

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
    <React.Fragment>
      <ApplicationModal showApplicationModal={showApplicationModal} onClose={closeModal} />
      <Grid hasGutter className="hacbs-app-workflow">
        <GridItem>
          <TextContent>
            <Text component={TextVariants.h3}>Application pipeline configuration.</Text>
            <Text component={TextVariants.p}>
              This is a visualization of your application pipeline, from source code, through tests
              to deployments.
              <Button className="pf-u-ml-xs pf-u-pl-xs" variant="link" onClick={openModal}>
                learn more
              </Button>
            </Text>
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
    </React.Fragment>
  );
};

export default AppWorkflowSection;
