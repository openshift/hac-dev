import * as React from 'react';
import { Link } from 'react-router-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Grid,
  GridItem,
  Spinner,
  Title,
  PageSection,
  PageSectionVariants,
  Toolbar,
  ToolbarItem,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { EnvironmentGroupVersionKind } from '../../models';
import { EnvironmentKind } from '../../types';
import { NamespaceContext } from '../NamespacedPage/NamespacedPage';
import EnvironmentCard from './EnvironmentCard';
import './EnvironmentListView.scss';

const EnvironmentListView: React.FC = () => {
  const { namespace } = React.useContext(NamespaceContext);
  const createEnvironment = (
    <Toolbar usePageInsets>
      <ToolbarItem>
        <Button
          variant="primary"
          component={(props) => (
            <Link {...props} to="/app-studio/workspace-settings/environment/create" />
          )}
        >
          Create Environment
        </Button>
      </ToolbarItem>
    </Toolbar>
  );

  const [environments, loaded] = useK8sWatchResource<EnvironmentKind[]>({
    groupVersionKind: EnvironmentGroupVersionKind,
    namespace,
    isList: true,
  });

  if (!loaded) {
    return (
      <PageSection variant={PageSectionVariants.light} isFilled>
        <Bullseye>
          <Spinner />
        </Bullseye>
      </PageSection>
    );
  }

  return (
    <>
      <Title headingLevel="h4">Environments</Title>
      {!environments || environments.length === 0 ? (
        <>
          <EmptyState variant={EmptyStateVariant.large}>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              No Environments
            </Title>
            <EmptyStateBody>To get started, create an environment.</EmptyStateBody>
            {createEnvironment}
          </EmptyState>
        </>
      ) : (
        <>
          {createEnvironment}
          <Grid hasGutter>
            {environments.map((env) => (
              <GridItem
                span={12}
                md={6}
                lg={3}
                key={env.metadata.name}
                data-test="environment-card"
                className="environment-list-view_card"
              >
                <EnvironmentCard environment={env} />
              </GridItem>
            ))}
          </Grid>
        </>
      )}
    </>
  );
};

export default EnvironmentListView;
