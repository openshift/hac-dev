export const componentsTableColumnClasses = {
  component: 'pf-m-width-30 wrap-column',
  buildPipeline: 'pf-m-width-15',
  buildTrigger: 'pf-m-width-15',
  latestBuild: 'pf-m-width-30',
  kebab: 'pf-m-width-10 component-list-view__actions',
};

const ComponentsListHeader = () => {
  return [
    {
      title: 'Component',
      props: { className: componentsTableColumnClasses.component },
    },
    {
      title: 'Build pipeline plan',
      props: { className: componentsTableColumnClasses.buildPipeline },
    },
    {
      title: 'Build trigger',
      props: { className: componentsTableColumnClasses.buildTrigger },
    },
    {
      title: 'Latest build',
      props: { className: componentsTableColumnClasses.latestBuild },
    },
    {
      title: ' ',
      props: { className: componentsTableColumnClasses.kebab },
    },
  ];
};

export default ComponentsListHeader;
