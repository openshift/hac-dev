import * as React from 'react';
import { Table } from '../../../shared';
import { SecretKind } from '../../../types';
import SecretsListHeader from './SecretsListHeader';
import SecretsListRow from './SecretsListRow';

type SecretsListProps = {
  secrets: SecretKind[];
};

const SecretsList: React.FC<React.PropsWithChildren<SecretsListProps>> = ({ secrets }) => {
  return (
    <>
      <Table
        data={secrets}
        aria-label="Secret List"
        Header={SecretsListHeader}
        Row={SecretsListRow}
        loaded
        getRowProps={(obj) => ({
          id: obj.metadata.name,
        })}
      />
    </>
  );
};

export default SecretsList;
