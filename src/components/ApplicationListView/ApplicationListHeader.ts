export const applicationTableColumnClasses = {
  name: 'pf-m-width-20',
  components: 'pf-m-width-30',
  environments: 'pf-m-hidden pf-m-visible-on-md pf-m-width-20',
  lastDeploy: 'pf-m-hidden pf-m-visible-on-lg pf-m-width-30',
  kebab: 'dropdown-kebab-pf pf-c-table__action',
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
      title: 'Environments',
      props: { className: applicationTableColumnClasses.environments },
    },
    {
      title: 'Last deploy',
      props: { className: applicationTableColumnClasses.lastDeploy },
    },
    {
      title: '',
      props: { className: applicationTableColumnClasses.kebab },
    },
  ];
};
