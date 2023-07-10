export const taskRunTableColumnClasses = {
  name: 'pf-m-width-25 wrap-column',
  task: 'pf-m-width-25',
  started: 'pf-m-width-25',
  status: 'pf-m-width-20',
  kebab: 'pf-c-table__action',
};

export const TaskRunListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: taskRunTableColumnClasses.name },
    },
    {
      title: 'Task',
      props: { className: taskRunTableColumnClasses.task },
    },
    {
      title: 'Started',
      props: { className: taskRunTableColumnClasses.started },
    },
    {
      title: 'Status',
      props: { className: taskRunTableColumnClasses.status },
    },
    {
      title: ' ',
      props: {
        className: taskRunTableColumnClasses.kebab,
      },
    },
  ];
};
