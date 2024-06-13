export const releasesPlanAdmissionTableColumnClasses = {
  name: 'pf-m-width-20 wrap-column',
  application: 'pf-m-width-30',
  source: 'pf-m-width-20',
  autoRelease: 'pf-m-width-20',
  kebab: 'pf-c-table__action',
};

const ReleasePlanAdmissionListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: releasesPlanAdmissionTableColumnClasses.name },
    },
    {
      title: 'Application',
      props: { className: releasesPlanAdmissionTableColumnClasses.application },
    },
    {
      title: 'Source Workspace',
      props: { className: releasesPlanAdmissionTableColumnClasses.source },
    },
    {
      title: 'Auto release',
      props: { className: releasesPlanAdmissionTableColumnClasses.autoRelease },
    },
    {
      title: ' ',
      props: {
        className: releasesPlanAdmissionTableColumnClasses.kebab,
      },
    },
  ];
};

export default ReleasePlanAdmissionListHeader;
