import * as React from 'react';
import { Text, TextVariants, Title } from '@patternfly/react-core';
import classNames from 'classnames';
import BreadCrumbs from '../breadcrumbs/BreadCrumbs';
import './Page.scss';

type PageProps = {
  breadcrumbs?: { path: string; name: string }[];
  className?: string;
  heading?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  titleSize?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  description?: string;
  isSection?: boolean;
  children: React.ReactNode;
  customButton?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({
  breadcrumbs,
  heading,
  headingLevel,
  titleSize,
  description,
  children,
  isSection,
  customButton = null,
}) => {
  return (
    <div className="hacDev-page">
      <div className="hacDev-page__section">
        {breadcrumbs && (
          <BreadCrumbs className="hacDev-page__breadcrumb" breadcrumbs={breadcrumbs} />
        )}
        <div>
          {heading && (
            <Title
              className="hacDev-page__heading"
              headingLevel={headingLevel || 'h1'}
              size={titleSize || '4xl'}
            >
              {heading}
            </Title>
          )}
          {<div className="hacDev-page__custom-button">{customButton}</div>}
        </div>
        {description && (
          <Text className="hacDev-page__description" component={TextVariants.p}>
            {description}
          </Text>
        )}
      </div>
      <div className={classNames({ 'hacDev-page__section': isSection })}>{children}</div>
    </div>
  );
};

export default Page;
