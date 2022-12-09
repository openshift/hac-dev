export const integrationListTableColumnClasses = {
  name: 'pf-m-width-25',
  containerImage: 'pf-m-width-35 pf-l-flex',
  mandatory: 'pf-m-width-20',
  pipeline: 'pf-m-width-15',
  kebab: 'pf-c-table__action pf-m-width-5',
};

export const IntegrationTestListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: integrationListTableColumnClasses.name },
    },
    {
      title: 'Container image',
      props: { className: integrationListTableColumnClasses.containerImage },
    },
    {
      title: 'Optional for release',
      props: { className: integrationListTableColumnClasses.mandatory },
    },
    {
      title: 'Pipelines',
      props: { className: integrationListTableColumnClasses.pipeline },
    },
    {
      title: '',
      props: {
        className: integrationListTableColumnClasses.kebab,
        style: { paddingRight: 64 },
      },
    },
  ];
};
