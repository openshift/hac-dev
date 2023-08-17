export const secretsTableColumnClasses = {
  secretFor: 'pf-m-width-25 pf-m-width-20-on-lg pf-m-width-15-on-xl',
  secretType: 'pf-m-width-25 pf-m-width-20-on-lg pf-m-width-15-on-xl',
  name: 'pf-m-width-25 pf-m-width-20-on-lg pf-m-width-20-on-xl wrap-column',
  target: 'pf-m-hidden pf-m-visible-on-lg pf-m-width-15 pf-m-width-15-on-xl',
  labels: 'pf-m-hidden pf-m-visible-on-xl pf-m-width-20 pf-m-width-15-on-xl',
  status: 'pf-m-hidden pf-m-visible-on-lg pf-m-width-20 pf-m-width-20-on-xl wrap-column',
  kebab: 'pf-c-table__action',
};

const SecretsListHeader = () => {
  return [
    {
      title: 'Secret for',
      props: { className: secretsTableColumnClasses.secretFor },
    },
    {
      title: 'Secret type',
      props: { className: secretsTableColumnClasses.secretType },
    },
    {
      title: 'Name',
      props: { className: secretsTableColumnClasses.name },
    },
    {
      title: 'Target',
      props: { className: secretsTableColumnClasses.target },
    },
    {
      title: 'Labels',
      props: { className: secretsTableColumnClasses.labels },
    },
    {
      title: 'Status',
      props: { className: secretsTableColumnClasses.status },
    },
    {
      title: ' ',
      props: { className: secretsTableColumnClasses.kebab },
    },
  ];
};

export default SecretsListHeader;
