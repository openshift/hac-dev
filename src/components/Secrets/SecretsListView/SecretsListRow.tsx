import * as React from 'react';
import { Label } from '@patternfly/react-core';
import { RowFunctionArgs, TableData } from '../../../shared';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import { RemoteSecretKind } from '../../../types/secret';
import { useSecretActions } from '../secret-actions';
import { getSecretRowData } from '../utils/secret-utils';
import { secretsTableColumnClasses } from './SecretsListHeader';

type SecretsListRowProps = RowFunctionArgs<RemoteSecretKind>;

export enum RemoteSecretStatus {
  Succeeded = 'Succeeded',
  Failed = 'Failed',
}

const SecretsListRow: React.FC<React.PropsWithChildren<SecretsListRowProps>> = ({ obj }) => {
  const actions = useSecretActions(obj);

  const { secretName, secretFor, secretLabels, secretType, secretStatus } = getSecretRowData(obj);
  const labels =
    secretLabels !== '-'
      ? secretLabels.split(', ').map((s) => <Label key={s}>{s}</Label>)
      : secretLabels;

  return (
    <>
      <TableData className={secretsTableColumnClasses.secretFor}>{secretFor}</TableData>
      <TableData className={secretsTableColumnClasses.secretType}>{secretType}</TableData>
      <TableData className={secretsTableColumnClasses.name}> {secretName} </TableData>
      <TableData className={secretsTableColumnClasses.labels}>{labels}</TableData>
      <TableData className={secretsTableColumnClasses.status}>{secretStatus}</TableData>
      <TableData className={secretsTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default SecretsListRow;
