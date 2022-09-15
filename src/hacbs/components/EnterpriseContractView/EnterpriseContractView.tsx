import React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Spinner,
  Text,
  Title,
} from '@patternfly/react-core';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/esm/icons/arrow-right-icon';
import { CubesIcon } from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { EnterpriseContractPolicyGroupVersionKind } from '../../models';
import {
  HACBS_ENTERPRISE_CONTRACT_INFO_LINK,
  HACBS_ENTERPRISE_CONTRACT_POLICIES_DATA,
} from './const';
import ReleasePolicyPackageItem from './ReleasePolicyPackageItem';
import { useEnterpriseContractPolicies } from './useEnterpriseContractPolicies';

import './EnterpriseContractView.scss';

const EnterpriseContractViewEmptyState: React.FC = () => (
  <EmptyState data-testid="enterprise-contract-view-empty-state" variant={EmptyStateVariant.large}>
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h4" size="lg">
      No release policies
    </Title>
  </EmptyState>
);

const EnterpriseContractView: React.FC = () => {
  const namespace = useNamespace();
  const [contractPolicies, loaded] = useEnterpriseContractPolicies(
    HACBS_ENTERPRISE_CONTRACT_POLICIES_DATA,
  );

  const [enterpriseContractPolicy, policyLoaded] = useK8sWatchResource<any>({
    groupVersionKind: EnterpriseContractPolicyGroupVersionKind,
    namespace,
  });

  const releasePolicies = React.useMemo(
    () =>
      loaded && contractPolicies?.releasePackages
        ? Object.keys(contractPolicies.releasePackages)
        : [],
    [contractPolicies, loaded],
  );

  return (
    <>
      <Text data-testid="enterprise-contract-title" component="p" className="pf-u-mt-lg">
        An Enterprise Contract (EC) is a set of release policies applied to your release target,
        also known as a managed environment.{' '}
        <ExternalLink
          href={HACBS_ENTERPRISE_CONTRACT_INFO_LINK}
          text={
            <>
              Learn more <ExternalLinkAltIcon />
            </>
          }
        />
      </Text>
      <Title headingLevel="h3" className="pf-u-mt-md pf-u-mb-md">
        Release Policy
      </Title>
      <Text component="p" className=" pf-u-mb-lg">
        These rules are applied to pipeline run attestations associated with container images build
        by HACBS. Follow these rules to be able to release successfully.
      </Text>
      {loaded ? (
        <>
          {releasePolicies.length ? (
            <div
              data-testid="enterprise-contract-package-list"
              className="enterprise-contract-view__package-list"
            >
              {contractPolicies?.releasePackages &&
                releasePolicies.map((packageKey) => (
                  <ReleasePolicyPackageItem
                    key={packageKey}
                    releasePackageInfo={contractPolicies.releasePackages[packageKey]}
                    releasePackageAnnotations={contractPolicies.releaseAnnotations[packageKey]}
                  />
                ))}
            </div>
          ) : (
            <EnterpriseContractViewEmptyState />
          )}
        </>
      ) : (
        <Bullseye className="pf-u-mt-lg">
          <Spinner />
        </Bullseye>
      )}
      {policyLoaded && enterpriseContractPolicy ? (
        <div data-testid="enterprise-contract-github-link" className="pf-u-mt-md">
          <ExternalLink href={enterpriseContractPolicy.sources?.git?.repository}>
            <Flex
              alignItems={{ default: 'alignItemsCenter' }}
              spaceItems={{ default: 'spaceItemsXs' }}
            >
              <FlexItem>View code on Github</FlexItem>
              <ArrowRightIcon />
            </Flex>
          </ExternalLink>
        </div>
      ) : null}
    </>
  );
};

export default EnterpriseContractView;
