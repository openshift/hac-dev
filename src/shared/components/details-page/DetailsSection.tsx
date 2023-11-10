import * as React from 'react';
import { Title } from '@patternfly/react-core';

import './DetailsSection.scss';

type DetailsSectionProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
};

const DetailsSection: React.FC<React.PropsWithChildren<DetailsSectionProps>> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="details-section">
      {title ? (
        <Title headingLevel="h4" className="details-section__title" size="lg">
          {title}
        </Title>
      ) : null}
      {description ? <div className="details-section__description">{description}</div> : null}
      {children}
    </div>
  );
};

export default DetailsSection;
