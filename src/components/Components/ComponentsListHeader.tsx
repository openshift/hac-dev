export const componentsTableColumnClasses = {
  component: 'pf-m-width-40 wrap-column',
  latestBuild: 'pf-m-width-40',
  kebab: 'pf-m-width-20 component-list-view__actions',
};

const ComponentsListHeader = () => {
  return [
    {
      title: 'Component',
      props: { className: componentsTableColumnClasses.component },
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
