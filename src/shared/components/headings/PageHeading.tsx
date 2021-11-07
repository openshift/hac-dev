import * as React from 'react';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import BreadCrumbs from '../breadcrumbs/BreadCrumbs';

interface PageHeadingProps {
  breadcrumbs: { name: string; path: string }[];
  title: string;
  description?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({ title, breadcrumbs, description }) => {
  return (
    <PageHeader>
      {breadcrumbs && <BreadCrumbs breadcrumbs={breadcrumbs} />}
      <PageHeaderTitle title={title} />
      <p>{description}</p>
    </PageHeader>
  );
};

export default PageHeading;
