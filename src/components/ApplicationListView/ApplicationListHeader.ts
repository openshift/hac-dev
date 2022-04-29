export const applicationTableColumnClasses = {
  name: 'pf-m-width-20',
  components: 'pf-u-w-25-on-lg pf-u-w-25-on-sm pf-u-w-16-on-xs',
  environments:
    'pf-m-hidden pf-m-visible-on-sm pf-u-w-25-on-xl pf-u-w-25-on-lg pf-u-w-25-on-md pf-u-w-16-on-sm',
  lastDeploy: 'pf-m-hidden pf-m-visible-on-md pf-u-w-25-on-xl pf-u-w-16-on-lg pf-u-w-16-on-md',
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
