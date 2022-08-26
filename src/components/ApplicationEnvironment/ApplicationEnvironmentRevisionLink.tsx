import * as React from 'react';
import { Flex, FlexItem, Label } from '@patternfly/react-core';
import { GithubIcon } from '@patternfly/react-icons/dist/esm/icons/github-icon';
import ExternalLink from '../../shared/components/links/ExternalLink';
import { ComponentKind } from '../../types';

const ApplicationEnvironmentRevisionLink: React.FC<{ component: ComponentKind }> = ({
  component,
}) => {
  return (
    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
      <FlexItem>
        <ExternalLink
          href={
            component.spec.source?.git?.url ||
            (component.spec.containerImage.includes('http')
              ? component.spec.containerImage
              : `https://${component.spec.containerImage}`)
          }
          text={
            <Label variant="outline" icon={<GithubIcon />}>
              72c1a29
            </Label>
          }
          stopPropagation
        />
      </FlexItem>
      <FlexItem>
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <ExternalLink
              href={
                component.spec.source?.git?.url ||
                (component.spec.containerImage.includes('http')
                  ? component.spec.containerImage
                  : `https://${component.spec.containerImage}`)
              }
              text={
                <span>
                  <b>#196</b> Linter updates
                </span>
              }
              stopPropagation
            />
          </FlexItem>
          <FlexItem>
            <ExternalLink
              additionalClassName="environment-list-item__breadcrumb-link"
              href={
                component.spec.source?.git?.url ||
                (component.spec.containerImage.includes('http')
                  ? component.spec.containerImage
                  : `https://${component.spec.containerImage}`)
              }
              text="by e_cary"
              stopPropagation
            />
          </FlexItem>
        </Flex>
      </FlexItem>
    </Flex>
  );
};

export default ApplicationEnvironmentRevisionLink;
