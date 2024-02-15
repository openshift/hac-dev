export const releasesPlanTableColumnClasses = {
  name: 'pf-m-width-20 wrap-column',
  application: 'pf-m-width-15',
  target: 'pf-m-width-15',
  autoRelease: 'pf-m-hidden pf-m-width-10 pf-m-visible-on-xl',
  standingAttribution: 'pf-m-hidden pf-m-width-15 pf-m-visible-on-xl',
  status: 'pf-m-hidden pf-m-width-15 pf-m-visible-on-xl',
  rpa: 'pf-m-hidden pf-m-width-15 pf-m-visible-on-xl',
  kebab: 'pf-v5-c-table__action',
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
      title: 'Status',
      props: { className: releasesPlanTableColumnClasses.status },
    },
    {
      title: 'Release plan admission',
      props: { className: releasesPlanTableColumnClasses.status },
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
