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
  PageSection,
  Panel,
  Spinner,
  Tab,
  Tabs,
  TabTitleText,
  Title,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { ComponentGroupVersionKind } from '../../models';
import { ApplicationKind, ComponentKind } from '../../types';
import { useNamespace } from '../../utils/namespace-context-utils';
import ComponentListView from './ComponentListView';

type ComponentDetailsProps = {
  application: ApplicationKind;
};

const ComponentDetailsEmptyState: React.FC<{ applicationName: string }> = ({ applicationName }) => (
  <EmptyState variant={EmptyStateVariant.large}>
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h4" size="lg">
      No components
    </Title>
    <EmptyStateBody>To get started, add a component to your application.</EmptyStateBody>
    <Button
      variant="primary"
      component={(props) => (
        <Link {...props} to={`/stonesoup/import?application=${applicationName}`} />
      )}
    >
      Add component
    </Button>
  </EmptyState>
);

export const ComponentDetails: React.FC<ComponentDetailsProps> = ({ application }) => {
  const namespace = useNamespace();
  const [components, componentsLoaded] = useK8sWatchResource<ComponentKind[]>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace,
    isList: true,
  });

  const applicationName = application.metadata?.name;

  const filteredComponents = React.useMemo(
    () =>
      componentsLoaded ? components?.filter((c) => c.spec.application === applicationName) : [],
    [components, applicationName, componentsLoaded],
  );

  return (
    <PageSection isFilled style={{ paddingTop: 0 }}>
      <Panel style={{ height: '100%' }}>
        <Title headingLevel="h1" className="pf-u-px-md pf-u-pt-sm pf-u-pb-0">
          Component Details
        </Title>
        <Tabs activeKey={0}>
          <Tab eventKey={0} title={<TabTitleText>Application components</TabTitleText>}>
            {!componentsLoaded ? (
              <Bullseye>
                <Spinner />
              </Bullseye>
            ) : filteredComponents.length > 0 ? (
              <ComponentListView
                applicationName={applicationName}
                components={filteredComponents}
              />
            ) : (
              <ComponentDetailsEmptyState applicationName={applicationName} />
            )}
          </Tab>
        </Tabs>
      </Panel>
    </PageSection>
  );
};
