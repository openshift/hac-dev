import * as React from 'react';
import {
  PageBreadcrumb,
  PageGroup,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from '@patternfly/react-core';
import BreadCrumbs from '../../shared/components/breadcrumbs/BreadCrumbs';

type PageLayoutProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  description?: string;
  breadcrumbs?: { name: string; path: string }[];
};

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  footer,
  description,
  breadcrumbs,
}) => {
  return (
    <>
      <PageGroup>
        {breadcrumbs && (
          <PageBreadcrumb>
            <BreadCrumbs breadcrumbs={breadcrumbs} />
          </PageBreadcrumb>
        )}
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">{title}</Text>
            {description && <Text component="p">{description}</Text>}
          </TextContent>
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
