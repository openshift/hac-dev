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
import { useSearchParam } from '../../../../../../hooks/useSearchParam';
import ApplicationModal from '../../../ApplicationModal';
import { WorkflowGraph } from '../visualization';
import GraphErrorState from '../visualization/GraphErrorState';
import { useAppWorkflowData } from '../visualization/hooks/useAppWorkflowData';

import './AppWorkflowSection.scss';

type AppWorkflowSectionProps = {
  applicationName: string;
};

const AppWorkflowSection: React.FC<AppWorkflowSectionProps> = ({ applicationName }) => {
  const [showApplicationModal, setShowApplicationModal] = React.useState<boolean>(false);
  const [expanded, setExpanded] = useSearchParam('expanded', '');

  const openModal = () => {
    setShowApplicationModal(true);
  };

  const closeModal = () => {
    setShowApplicationModal(false);
  };

  const [workflowModel, loaded, errors] = useAppWorkflowData(applicationName, expanded === 'true');

  const toggleExpanded = () => {
    setExpanded(expanded ? '' : 'true');
  };

  return (
    <React.Fragment>
      <ApplicationModal showApplicationModal={showApplicationModal} onClose={closeModal} />
      <Grid hasGutter className="hacbs-app-workflow">
        <GridItem>
          <TextContent>
            <Text component={TextVariants.h3}>Lifecycle</Text>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
              <FlexItem>
                <Text component={TextVariants.p}>
                  This is a visualization of your application pipeline, from source code through
                  test to deployments.
                  <Button className="pf-u-ml-xs pf-u-pl-xs" variant="link" onClick={openModal}>
                    Learn more
                  </Button>
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
          </>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default AppWorkflowSection;
