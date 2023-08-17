import * as React from 'react';
import { useSortedEnvironments } from '../../../hooks/useEnvironments';
import { Table } from '../../../shared';
import { RemoteSecretKind } from '../../../types';
import SecretsListHeader from './SecretsListHeader';
import SecretsListRow from './SecretsListRow';

type SecretsListProps = {
  secrets: RemoteSecretKind[];
};

const SecretsList: React.FC<SecretsListProps> = ({ secrets }) => {
  const [environments, environmentsLoaded] = useSortedEnvironments();

  const environmentNames = React.useMemo(
    () => environments.map((e) => e.metadata.name),
    [environments],
  );

  return (
    <>
      <Table
        data={secrets}
        aria-label="Secret List"
        Header={SecretsListHeader}
        Row={SecretsListRow}
        customData={{ environmentNames, environmentsLoaded }}
        loaded
        getRowProps={(obj) => ({
          id: obj.metadata.name,
        })}
      />
    </>
  );
};

export default SecretsList;
