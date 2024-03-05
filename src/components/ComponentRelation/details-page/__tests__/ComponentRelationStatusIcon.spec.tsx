import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ComponentKind } from '../../../../types';
import { ComponentRelationStatusIcon } from '../ComponentRelationStatusIcon';
import '@testing-library/jest-dom';

describe('ComponentRelationStatusIcon', () => {
  it('should render the icon if build nudge ref is present', () => {
    render(
      <ComponentRelationStatusIcon
        component={{ spec: { 'build-nudges-ref': ['cmp'] } } as ComponentKind}
      />,
    );
    expect(screen.queryByAltText('Component is in a relationship icon')).toBeInTheDocument();
  });

  it('should render the icon if build nudge by is present', () => {
    render(
      <ComponentRelationStatusIcon
        component={{ status: { 'build-nudged-by': ['cmp'] } } as ComponentKind}
      />,
    );
    expect(screen.queryByAltText('Component is in a relationship icon')).toBeInTheDocument();
  });

  it('should not render the icon if build nudge by and build nudge ref is not present', () => {
    render(
      <ComponentRelationStatusIcon component={{ metadata: { name: 'cmp' } } as ComponentKind} />,
    );
    expect(screen.queryByAltText('Component is in a relationship icon')).not.toBeInTheDocument();
  });
});
