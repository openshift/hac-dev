import * as React from 'react';
import { Text, TextVariants, Title } from '@patternfly/react-core';
import BreadCrumbs from '../../shared/components/breadcrumbs/BreadCrumbs';
import './Page.scss';

type PageProps = {
  breadcrumbs?: { path: string; name: string }[];
  heading: string;
  description?: string;
  children: React.ReactNode;
};

export const Page: React.FC<PageProps> = ({ breadcrumbs, heading, description, children }) => {
  return (
    <div className="hacDev-page">
      {breadcrumbs && <BreadCrumbs className="hacDev-page__breadcrumb" breadcrumbs={breadcrumbs} />}
      <Title className="hacDev-page__heading" headingLevel="h1" size="4xl">
        {heading}
      </Title>
      {description && (
        <Text className="hacDev-page__description" component={TextVariants.p}>
          {description}
        </Text>
      )}
      {children}
    </div>
  );
};
