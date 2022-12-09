export const pipelineRunTableColumnClasses = {
  name: 'pf-m-width-20',
  status: 'pf-m-width-15',
  started: 'pf-m-width-15',
  type: 'pf-m-hidden pf-m-visible-on-xl',
  duration: 'pf-m-width-15',
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
      title: '',
      props: { className: pipelineRunTableColumnClasses.kebab },
    },
  ];
};
