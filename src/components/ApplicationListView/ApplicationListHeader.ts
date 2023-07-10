export const applicationTableColumnClasses = {
  name: 'pf-m-width-35',
  components: 'pf-m-width-30',
  lastDeploy: 'pf-m-width-30',
  kebab: 'pf-c-table__action',
};

export const ApplicationListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: applicationTableColumnClasses.name },
    },
    {
      title: 'Components',
      props: { className: applicationTableColumnClasses.components },
    },
    {
      title: 'Last deploy',
      props: { className: applicationTableColumnClasses.lastDeploy },
    },
    {
      title: ' ',
      props: {
        className: applicationTableColumnClasses.kebab,
      },
    },
  ];
};
