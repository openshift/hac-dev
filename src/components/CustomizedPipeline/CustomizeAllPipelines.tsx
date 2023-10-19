import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Modal,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { useComponents } from '../../hooks/useComponents';
import { ComponentModel } from '../../models';
import { ComponentKind } from '../../types';
import { useAccessReviewForModel } from '../../utils/rbac';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { ButtonWithAccessTooltip } from '../ButtonWithAccessTooltip';
import { RawComponentProps } from '../modal/createModalLauncher';
import CustomizePipeline from './CustomizePipelines';

type Props = RawComponentProps & {
  applicationName: string;
  namespace: string;
  filter?: (component: ComponentKind) => boolean;
};

const CustomizeAllPipelines: React.FC<React.PropsWithChildren<Props>> = ({
  applicationName,
  namespace,
  filter,
  onClose,
  modalProps,
}) => {
  const { workspace } = useWorkspaceInfo();
  const [components, loaded] = useComponents(namespace, applicationName);
  const [canCreateComponent] = useAccessReviewForModel(ComponentModel, 'create');
  const filteredComponents = React.useMemo(
    () => (loaded ? (filter ? components.filter(filter) : components) : []),
    [loaded, components, filter],
  );

  if (loaded) {
    if (filteredComponents.length > 0) {
      return (
        <CustomizePipeline
          components={filteredComponents}
          onClose={onClose}
          modalProps={modalProps}
        />
      );
    }

    return (
      <Modal {...modalProps}>
        <EmptyState variant={EmptyStateVariant.lg}>
          <EmptyStateHeader titleText="No components" headingLevel="h4" />
          <EmptyStateBody>To get started, add a component to your application.</EmptyStateBody>
          <EmptyStateFooter>
            <ButtonWithAccessTooltip
              variant="primary"
              component={(props) => (
                <Link
                  {...props}
                  to={`/application-pipeline/workspaces/${workspace}/import?application=${applicationName}`}
                />
              )}
              isDisabled={!canCreateComponent}
              tooltip="You don't have access to add a component"
              analytics={{
                link_name: 'add-component',
                link_location: 'manage-build-pipelines',
                app_name: applicationName,
                workspace,
              }}
            >
              Add component
            </ButtonWithAccessTooltip>
          </EmptyStateFooter>
        </EmptyState>
      </Modal>
    );
  }
  return null;
};

export default CustomizeAllPipelines;
