import * as React from 'react';
import { Skeleton } from '@patternfly/react-core';
import { RowFunctionArgs, TableData } from '../../../shared';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import { RemoteSecretKind } from '../../../types/secret';
import { useSecretActions } from '../secret-actions';
import { getSecretRowData } from '../secret-utils';
import { secretsTableColumnClasses } from './SecretsListHeader';

type SecretsListRowProps = RowFunctionArgs<RemoteSecretKind>;

export enum RemoteSecretStatus {
  Succeeded = 'Succeeded',
  Failed = 'Failed',
}

const SecretsListRow: React.FC<SecretsListRowProps> = ({ obj, customData }) => {
  const { environmentNames = [], environmentsLoaded } = customData;
  const actions = useSecretActions(obj);

  const { secretName, secretFor, secretTarget, secretLabels, secretType, secretStatus } =
    getSecretRowData(obj, environmentNames);
  const environmentsTarget = environmentsLoaded ? (
    secretTarget
  ) : (
    <Skeleton screenreaderText="Loading Environments" />
  );

  return (
    <>
      <TableData className={secretsTableColumnClasses.secretFor}>{secretFor}</TableData>
      <TableData className={secretsTableColumnClasses.secretType}>{secretType}</TableData>
      <TableData className={secretsTableColumnClasses.name}> {secretName} </TableData>
      <TableData className={secretsTableColumnClasses.target}>{environmentsTarget}</TableData>
      <TableData className={secretsTableColumnClasses.labels}>{secretLabels}</TableData>
      <TableData className={secretsTableColumnClasses.status}>{secretStatus}</TableData>
      <TableData className={secretsTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default SecretsListRow;
