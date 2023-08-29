export const commitsTableColumnClasses = {
  name: 'pf-m-width-20 wrap-column',
  image: 'pf-m-width-35 pf-m-width-25-on-lg wrap-column',
  url: 'pf-m-width-35 pf-m-width-25-on-lg',
  revision: 'pf-m-hidden pf-m-visible-on-lg pf-m-width-20 pf-m-width-10-on-xl',
  kebab: 'pf-c-table__action',
};

const SnapshotComponentListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: commitsTableColumnClasses.name },
    },
    {
      title: 'Container Image',
      props: { className: commitsTableColumnClasses.image },
    },
    {
      title: 'Git URL',
      props: { className: commitsTableColumnClasses.url },
    },
    {
      title: 'Revision',
      props: { className: commitsTableColumnClasses.revision },
    },
  ];
};

export default SnapshotComponentListHeader;
