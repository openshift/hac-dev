import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Spinner,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { ApplicationGroupVersionKind } from '../../models';
import { Table } from '../../shared';
import { ApplicationKind } from '../../types';
import { NamespaceContext } from '../NamespacedPage/NamespacedPage';
import { ApplicationListHeader } from './ApplicationListHeader';
import ApplicationListRow from './ApplicationListRow';

const ApplicationView: React.FC = () => {
  const { namespace } = React.useContext(NamespaceContext);

  const [applications, loaded] = useK8sWatchResource<ApplicationKind[]>({
    groupVersionKind: ApplicationGroupVersionKind,
    namespace,
    isList: true,
  });

  if (!loaded) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  applications?.sort(
    (app1, app2) =>
      +new Date(app2.metadata.creationTimestamp) - +new Date(app1.metadata.creationTimestamp),
  );

  if (!applications || applications.length === 0) {
    return (
      <EmptyState variant={EmptyStateVariant.large}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h4" size="lg">
          No applications
        </Title>
        <EmptyStateBody>To get started, create an application.</EmptyStateBody>
        <Button
          variant="primary"
          component={(props) => <Link {...props} to="/app-studio/import" />}
        >
          Create application
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <Toolbar usePageInsets>
        <ToolbarContent>
          <ToolbarItem>
            <Button
              variant="primary"
              component={(props) => <Link {...props} to="/app-studio/import" />}
            >
              Create application
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table
        data={applications}
        aria-label="Application List"
        Header={ApplicationListHeader}
        Row={ApplicationListRow}
        loaded={loaded}
        getRowProps={(obj: ApplicationKind) => ({
          id: obj.metadata.name,
        })}
      />
    </>
  );
};

export default ApplicationView;
