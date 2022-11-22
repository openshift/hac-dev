import * as React from 'react';
import {
  Flex,
  FlexItem,
  PageBreadcrumb,
  PageGroup,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from '@patternfly/react-core';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { Action, ActionMenuVariant } from '../../shared/components/action-menu/types';
import BreadCrumbs from '../../shared/components/breadcrumbs/BreadCrumbs';

type PageLayoutProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: { name: string; path: string }[];
  breadcrumbItems?: React.ReactNode;
  actions?: Action[];
};

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  footer,
  description,
  breadcrumbs,
  breadcrumbItems,
  actions,
}) => {
  return (
    <>
      <PageGroup>
        {breadcrumbs && (
          <PageBreadcrumb>
            <BreadCrumbs breadcrumbs={breadcrumbs} breadcrumbItems={breadcrumbItems} />
          </PageBreadcrumb>
        )}
        <PageSection variant={PageSectionVariants.light}>
          <Flex>
            <FlexItem>
              <TextContent>
                <Text component="h1">{title}</Text>
                {description && <Text component="p">{description}</Text>}
              </TextContent>
            </FlexItem>
            {actions && (
              <FlexItem align={{ default: 'alignRight' }}>
                <ActionMenu variant={ActionMenuVariant.PRIMARY} actions={actions} />
              </FlexItem>
            )}
          </Flex>
        </PageSection>
      </PageGroup>
      {children}
      {footer && (
        <PageSection variant={PageSectionVariants.light} isFilled={false} sticky="bottom">
          {footer}
        </PageSection>
      )}
    </>
  );
};

export default PageLayout;
