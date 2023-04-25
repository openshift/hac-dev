import * as React from 'react';
import { InputField } from '../../../shared';
import { ClusterType, clusterTypeValues } from '../environment-utils';

type IngressDomainFieldProps = {
  clusterType: string;
};

const helpText =
  `Enter the domain name to access the cluster's application and services. ` +
  `For non-OpenShift clusters, it looks like $(minikube ip).nip.io and for OpenShift clusters, it looks like apps.xyz.rhcloud.com`;

const IngressDomainField: React.FC<IngressDomainFieldProps> = ({ clusterType }) => {
  if (clusterType !== clusterTypeValues[ClusterType.kubernetes]) {
    return null;
  }

  return (
    <InputField
      label="Ingress domain"
      aria-label="Ingress domain"
      name="ingressDomain"
      helpText={helpText}
      required
      placeholder="Enter the domain name"
    />
  );
};

export default IngressDomainField;
