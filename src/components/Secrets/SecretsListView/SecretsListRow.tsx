import * as React from 'react';
import { Label } from '@patternfly/react-core';
import { RowFunctionArgs, TableData } from '../../../shared';
import ActionMenu from '../../../shared/components/action-menu/ActionMenu';
import { SecretKind } from '../../../types/secret';
import { useSecretActions } from '../secret-actions';
import { getSecretRowLabels, getSecretTypetoLabel } from '../utils/secret-utils';
import { secretsTableColumnClasses } from './SecretsListHeader';

type SecretsListRowProps = RowFunctionArgs<SecretKind>;

export enum RemoteSecretStatus {
  Succeeded = 'Succeeded',
  Failed = 'Failed',
}

const SecretsListRow: React.FC<React.PropsWithChildren<SecretsListRowProps>> = ({ obj }) => {
  const actions = useSecretActions(obj);

  const { secretLabels } = getSecretRowLabels(obj);
  const labels =
    secretLabels !== '-'
      ? secretLabels.split(', ').map((s) => <Label key={s}>{s}</Label>)
      : secretLabels;

  return (
    <>
      <TableData className={secretsTableColumnClasses.secretType}>
        {getSecretTypetoLabel(obj) ?? '-'}
      </TableData>
      <TableData className={secretsTableColumnClasses.name}> {obj.metadata?.name} </TableData>
      <TableData className={secretsTableColumnClasses.labels}>{labels}</TableData>
      <TableData className={secretsTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default SecretsListRow;
