export const releasesPlanTableColumnClasses = {
  name: 'pf-m-width-25 wrap-column',
  application: 'pf-m-width-15',
  target: 'pf-m-width-20',
  autoRelease: 'pf-m-width-15',
  standingAttribution: 'pf-m-width-15',
  kebab: 'pf-c-table__action',
};

const ReleasePlanListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: releasesPlanTableColumnClasses.name },
    },
    {
      title: 'Application',
      props: { className: releasesPlanTableColumnClasses.application },
    },
    {
      title: 'Target Workspace',
      props: { className: releasesPlanTableColumnClasses.target },
    },
    {
      title: 'Auto release',
      props: { className: releasesPlanTableColumnClasses.autoRelease },
    },
    {
      title: 'Standing attribution',
      props: { className: releasesPlanTableColumnClasses.standingAttribution },
    },
    {
      title: ' ',
      props: {
        className: releasesPlanTableColumnClasses.kebab,
      },
    },
  ];
};

export default ReleasePlanListHeader;
