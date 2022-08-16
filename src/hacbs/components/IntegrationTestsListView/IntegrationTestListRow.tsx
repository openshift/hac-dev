import * as React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { RowFunctionArgs, TableData } from '../../../shared/components/table';
import { IntegrationTestScenarioKind } from '../../types/coreBuildService';
import { integrationListTableColumnClasses } from './IntegrationTestListHeader';
import { useIntegrationTestActions } from './useIntegrationTestActions';

const IntegrationTestListRow: React.FC<RowFunctionArgs<IntegrationTestScenarioKind>> = ({
  obj,
}) => {
  const actions = useIntegrationTestActions(obj);
  const containerImageUrl = `https://${obj.spec.bundle}`;
  return (
    <>
      <TableData
        className={integrationListTableColumnClasses.name}
        data-test="integration-tests__row-name"
      >
        {obj.metadata.name}
      </TableData>
      <TableData className={integrationListTableColumnClasses.containerImage}>
        <ExternalLink
          href={containerImageUrl}
          text={
            <span>
              {containerImageUrl} <ExternalLinkAltIcon />
            </span>
          }
          stopPropagation
        />
      </TableData>
      <TableData className={integrationListTableColumnClasses.mandatory}>
        {obj.spec.optional ? 'Optional' : 'Mandatory'}
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
