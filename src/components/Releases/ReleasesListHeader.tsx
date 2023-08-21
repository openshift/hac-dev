export const releasesTableColumnClasses = {
  name: 'pf-m-width-25 wrap-column',
  status: 'pf-m-width-20',
  releasePlan: 'pf-m-width-25',
  releaseSnapshot: 'pf-m-hidden pf-m-width-25 pf-m-visible-on-xl',
  kebab: 'pf-v5-c-table__action',
};

const ReleasesListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: releasesTableColumnClasses.name },
    },
    {
      title: 'Status',
      props: { className: releasesTableColumnClasses.status },
    },
    {
      title: 'Release Plan',
      props: { className: releasesTableColumnClasses.releasePlan },
    },
    {
      title: 'Release Snapshot',
      props: { className: releasesTableColumnClasses.releaseSnapshot },
    },
    {
      title: ' ',
      props: {
        className: releasesTableColumnClasses.kebab,
      },
    },
  ];
};

export default ReleasesListHeader;
