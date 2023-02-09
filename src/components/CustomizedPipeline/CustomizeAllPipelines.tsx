import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { useComponents } from '../../hooks/useComponents';
import { ComponentKind } from '../../types';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ComponentProps } from '../modal/createModalLauncher';
import CustomizePipeline from './CustomizePipelines';

type Props = ComponentProps & {
  applicationName: string;
  namespace: string;
  filter?: (component: ComponentKind) => boolean;
};

const CustomizeAllPipelines: React.FC<Props> = ({
  applicationName,
  namespace,
  filter,
  onClose,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [components, loaded] = useComponents(namespace, applicationName);
  const filteredComponents = React.useMemo(
    () => (loaded ? (filter ? components.filter(filter) : components) : []),
    [loaded, components, filter],
  );

  if (loaded) {
    if (components.length > 0) {
      return <CustomizePipeline components={filteredComponents} onClose={onClose} />;
    }

    return (
      <EmptyState variant={EmptyStateVariant.large}>
        <Title headingLevel="h4" size="lg">
          No components
        </Title>
        <EmptyStateBody>To get started, add a component to your application.</EmptyStateBody>
        <Button
          variant="primary"
          component={(props) => (
            <Link
              {...props}
              to={`/stonesoup/workspaces/${workspace}/import?application=${applicationName}`}
            />
          )}
        >
          Add component
        </Button>
      </EmptyState>
    );
  }
  return null;
};

export default CustomizeAllPipelines;
