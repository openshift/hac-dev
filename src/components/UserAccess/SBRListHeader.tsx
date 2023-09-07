export const sbrTableColumnClasses = {
  username: 'pf-m-width-25',
  role: 'pf-m-width-20',
  status: 'pf-m-hidden pf-m-visible-on-md pf-m-width-20',
  kebab: 'pf-v5-c-table__action',
};

export const SBRListHeader = () => [
  {
    title: 'Username',
    props: { className: sbrTableColumnClasses.username },
  },
  {
    title: 'Role',
    props: { className: sbrTableColumnClasses.role },
  },
  {
    title: 'Status',
    props: { className: sbrTableColumnClasses.status },
  },
  {
    title: ' ',
    props: {
      className: sbrTableColumnClasses.kebab,
    },
  },
];
