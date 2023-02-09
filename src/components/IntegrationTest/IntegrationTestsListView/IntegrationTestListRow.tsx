import * as React from 'react';
import { Link } from 'react-router-dom';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { RowFunctionArgs, TableData } from '../../../shared/components/table';
import { IntegrationTestScenarioKind } from '../../../types/coreBuildService';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { IntegrationTestLabels } from '../IntegrationTestForm/types';
import { integrationListTableColumnClasses } from './IntegrationTestListHeader';
import { useIntegrationTestActions } from './useIntegrationTestActions';

const IntegrationTestListRow: React.FC<RowFunctionArgs<IntegrationTestScenarioKind>> = ({
  obj,
}) => {
  const actions = useIntegrationTestActions(obj);
  const { workspace } = useWorkspaceInfo();
  const containerImageUrl = `https://${obj.spec.bundle}`;
  return (
    <>
      <TableData
        className={integrationListTableColumnClasses.name}
        data-test="integration-tests__row-name"
      >
        <Link
          to={`/stonesoup/workspaces/${workspace}/applications/${obj.spec.application}/integrationtests/${obj.metadata.name}`}
        >
          {obj.metadata.name}
        </Link>
      </TableData>
      <TableData className={integrationListTableColumnClasses.containerImage}>
        <ExternalLink href={containerImageUrl} text={containerImageUrl} stopPropagation />
      </TableData>
      <TableData className={integrationListTableColumnClasses.mandatory}>
        {obj.metadata.labels?.[IntegrationTestLabels.OPTIONAL] === 'true'
          ? 'Optional'
          : 'Mandatory'}
      </TableData>
      <TableData className={integrationListTableColumnClasses.pipeline}>
        {obj.spec.pipeline}
      </TableData>
      <TableData className={integrationListTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default IntegrationTestListRow;
