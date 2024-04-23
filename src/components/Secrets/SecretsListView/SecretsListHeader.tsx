export const secretsTableColumnClasses = {
  secretType: 'pf-m-width-30',
  name: 'pf-m-width-30 wrap-column',
  labels: 'pf-m-width-30 wrap-column',
  kebab: 'pf-c-table__action',
};

const SecretsListHeader = () => {
  return [
    {
      title: 'Secret type',
      props: { className: secretsTableColumnClasses.secretType },
    },
    {
      title: 'Name',
      props: { className: secretsTableColumnClasses.name },
    },
    {
      title: 'Labels',
      props: { className: secretsTableColumnClasses.labels },
    },
    {
      title: ' ',
      props: { className: secretsTableColumnClasses.kebab },
    },
  ];
};

export default SecretsListHeader;
