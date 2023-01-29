export const pipelineRunTableColumnClasses = {
  name: 'pf-m-width-20',
  status: 'pf-m-width-10',
  started: 'pf-m-width-20',
  type: 'pf-m-hidden pf-m-visible-on-xl pf-m-width-10',
  duration: 'pf-m-hidden pf-m-visible-on-xl pf-m-width-10',
  component: 'pf-m-hidden pf-m-visible-on-xl',
  kebab: 'pf-c-table__action',
};

export const PipelineRunListHeader = () => {
  return [
    {
      title: 'Name',
      props: { className: pipelineRunTableColumnClasses.name },
    },
    {
      title: 'Started',
      props: { className: pipelineRunTableColumnClasses.started },
    },
    {
      title: 'Duration',
      props: { className: pipelineRunTableColumnClasses.duration },
    },
    {
      title: 'Status',
      props: { className: pipelineRunTableColumnClasses.status },
    },
    {
      title: 'Type',
      props: { className: pipelineRunTableColumnClasses.type },
    },
    {
      title: 'Component',
      props: { className: pipelineRunTableColumnClasses.component },
    },
    {
      title: '',
      props: { className: pipelineRunTableColumnClasses.kebab },
    },
  ];
};
