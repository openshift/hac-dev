export const integrationListTableColumnClasses = {
  name: 'pf-m-width-25',
  containerImage: 'pf-m-width-25 pf-v5-l-flex',
  mandatory: 'pf-m-width-25',
  pipeline: 'pf-m-width-15',
  kebab: 'pf-v5-c-table__action',
};

export const IntegrationTestListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: integrationListTableColumnClasses.name },
    },
    {
      title: 'GitHub URL',
      props: { className: integrationListTableColumnClasses.containerImage },
    },
    {
      title: 'Optional for release',
      props: { className: integrationListTableColumnClasses.mandatory },
    },
    {
      title: 'Revision',
      props: { className: integrationListTableColumnClasses.pipeline },
    },
    {
      title: ' ',
      props: {
        className: integrationListTableColumnClasses.kebab,
      },
    },
  ];
};
