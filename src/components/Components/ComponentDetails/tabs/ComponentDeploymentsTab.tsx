import * as React from 'react';
import DetailsSection from '../../../../shared/components/details-page/DetailsSection';
import { ComponentKind } from '../../../../types';
import ComponentDeploymentsListView from '../../ComponentDeployments/ComponentDeploymentsListView';

type ComponentDeploymentsTabProps = {
  component: ComponentKind;
};

/**
 * @deprecated Remove Environments and Deployment references
 * https://issues.redhat.com/browse/HAC-5682
 */
export const ComponentDeploymentsTab: React.FC<
  React.PropsWithChildren<ComponentDeploymentsTabProps>
> = ({ component }) => (
  <div>
    <DetailsSection
      title="Deployments"
      description="Component builds that are currently deployed to environments."
    >
      <ComponentDeploymentsListView component={component} />
    </DetailsSection>
  </div>
);

export default React.memo(ComponentDeploymentsTab);
