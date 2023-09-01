export const componentDeploymentsColumnClasses = {
  environment: 'pf-m-width-30 wrap-column',
  componentDeployed: 'pf-m-width-20',
  snapshot: 'pf-m-width-20',
  vulnerabilities: 'pf-m-width-20',
  logs: 'pf-c-table__action',
};

const ComponentDeploymentsListHeader = () => {
  return [
    {
      title: 'Environment',
      props: { className: componentDeploymentsColumnClasses.environment },
    },
    {
      title: 'Component deployed',
      props: { className: componentDeploymentsColumnClasses.componentDeployed },
    },
    {
      title: 'Snapshot',
      props: { className: componentDeploymentsColumnClasses.snapshot },
    },
    {
      title: 'Vulnerabilities',
      props: { className: componentDeploymentsColumnClasses.vulnerabilities },
    },
    {
      title: '',
      props: { className: componentDeploymentsColumnClasses.logs },
    },
  ];
};

export default ComponentDeploymentsListHeader;
