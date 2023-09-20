export const releasesStrategyTableColumnClasses = {
  name: 'pf-m-width-20 wrap-column',
  pipeline: 'pf-m-width-15',
  policy: 'pf-m-width-20',
  bundle: 'pf-m-width-35',
  kebab: 'pf-c-table__action',
};

const ReleaseStrategyListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: releasesStrategyTableColumnClasses.name },
    },
    {
      title: 'Pipeline',
      props: { className: releasesStrategyTableColumnClasses.pipeline },
    },
    {
      title: 'Policy',
      props: { className: releasesStrategyTableColumnClasses.policy },
    },
    {
      title: 'Bundle',
      props: { className: releasesStrategyTableColumnClasses.bundle },
    },
    {
      title: ' ',
      props: {
        className: releasesStrategyTableColumnClasses.kebab,
      },
    },
  ];
};

export default ReleaseStrategyListHeader;
