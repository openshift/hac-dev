import * as React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import relationIcon from '../../../imgs/RelationsIcon.svg';
import { ComponentKind } from '../../../types';

import './ComponentRelationStatusIcon.scss';

export const ComponentRelationStatusIcon: React.FC<{
  component: ComponentKind;
  className?: string;
  style?: { [key: string]: any };
}> = ({ component, className, style }) => {
  const isInRelationship = !!(
    component.spec?.['build-nudges-ref']?.length ?? component.status?.['build-nudged-by']?.length
  );
  return isInRelationship ? (
    <Tooltip content="This component is in a relationship">
      <img
        style={style}
        className={css('component-relation-status-icon', className)}
        src={relationIcon}
        alt="Component is in a relationship icon"
      />
    </Tooltip>
  ) : null;
};
