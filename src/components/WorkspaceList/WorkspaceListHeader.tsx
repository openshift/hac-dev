export const workspaceTableColumnClasses = {
  name: 'pf-m-width-30 wrap-column',
  owner: 'pf-m-width-30',
  visibility: 'pf-m-width-30 wrap-column',
  kebab: 'pf-c-table__action',
};

const SecretsListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: workspaceTableColumnClasses.name },
    },
    {
      title: 'Owner',
      props: { className: workspaceTableColumnClasses.owner },
    },
    {
      title: 'Visibility',
      props: { className: workspaceTableColumnClasses.visibility },
    },
    {
      title: ' ',
      props: { className: workspaceTableColumnClasses.kebab },
    },
  ];
};

export default SecretsListHeader;
