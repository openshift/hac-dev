import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateProps,
  EmptyStateVariant,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import securityShieldImg from '../../imgs/shield-security.svg';

import './EmptyState.scss';

const EmptyStateImg = () => (
  <img className="app-empty-state__icon" src={securityShieldImg} alt="" />
);

const SecurityTabEmptyState: React.FC<Omit<EmptyStateProps, 'children'>> = ({ ...props }) => {
  const navigate = useNavigate();
  const { appName, plrName, workspaceName } = useParams();
  return (
    <EmptyState
      className="app-empty-state"
      data-testid="security-tab-empty-state"
      variant={EmptyStateVariant.full}
      {...props}
    >
      <EmptyStateHeader
        titleText="Security information unavailable"
        icon={<EmptyStateIcon icon={EmptyStateImg} />}
        headingLevel="h2"
      />
      <EmptyStateBody>We don&apos;t have any logs to show right now.</EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button
            variant={ButtonVariant.primary}
            onClick={() =>
              navigate(
                `/application-pipeline/workspaces/${workspaceName}/applications/${appName}/pipelineruns/${plrName}`,
              )
            }
          >
            Return to pipeline run details
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default SecurityTabEmptyState;
