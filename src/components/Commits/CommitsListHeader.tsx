export const commitsTableColumnClasses = {
  name: 'pf-m-width-35 wrap-column',
  branch: 'pf-m-width-20 pf-m-width-10-on-lg',
  component: 'pf-m-width-35 pf-m-width-25-on-lg pf-m-width-15-on-xl',
  byUser: 'pf-m-hidden pf-m-visible-on-xl pf-m-width-10',
  committedAt: 'pf-m-hidden pf-m-visible-on-lg pf-m-width-20 pf-m-width-10-on-xl',
  status: 'pf-m-hidden pf-m-visible-on-xl pf-m-width-10',
  kebab: 'pf-c-table__action',
};

const CommitsListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: commitsTableColumnClasses.name },
    },
    {
      title: 'Branch',
      props: { className: commitsTableColumnClasses.branch },
    },
    {
      title: 'Component',
      props: { className: commitsTableColumnClasses.component },
    },
    {
      title: 'By user',
      props: { className: commitsTableColumnClasses.byUser },
    },
    {
      title: 'Latest commit at',
      props: { className: commitsTableColumnClasses.committedAt },
    },
    {
      title: 'Status',
      props: { className: commitsTableColumnClasses.status },
    },
    {
      title: ' ',
      props: { className: commitsTableColumnClasses.kebab },
    },
  ];
};

export default CommitsListHeader;
