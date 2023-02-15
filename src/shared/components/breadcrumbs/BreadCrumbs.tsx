import * as React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

type BreadCrumbsProps = {
  breadcrumbs: ({ name: string; path: string } | React.ReactElement)[];
  className?: string;
};

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ breadcrumbs, className }) => (
  <Breadcrumb className={className}>
    {breadcrumbs.map((crumb, i, { length }) => {
      const isLast = i === length - 1;

      if (React.isValidElement(crumb)) {
        return <React.Fragment key={crumb.key}>{crumb}</React.Fragment>;
      }

      return (
        <BreadcrumbItem key={crumb.name} component="div" isActive={isLast}>
          {isLast || !crumb.path ? (
            crumb.name
          ) : (
            <Link
              className="pf-c-breadcrumb__link"
              to={crumb.path}
              data-test-id={`breadcrumb-link-${i}`}
            >
              {crumb.name}
            </Link>
          )}
        </BreadcrumbItem>
      );
    })}
  </Breadcrumb>
);

export default BreadCrumbs;
