import * as React from 'react';
import { configure, screen } from '@testing-library/react';
import { formikRenderer } from '../../../utils/test-utils';
import { ComponentRelation } from '../ComponentRelationForm';
import { ComponentRelationNudgeType } from '../type';

configure({ testIdAttribute: 'id' });

describe('ComponentRelationForm', () => {
  it('should render component relation form', () => {
    formikRenderer(<ComponentRelation index={0} componentNames={['asdf', 'asd']} />, {
      relations: [
        { source: 'asdf', target: ['asd'], nudgeType: ComponentRelationNudgeType.NUDGES },
      ],
    });
    expect(screen.getAllByTestId('toggle-component-menu')).toHaveLength(2);
    expect(screen.getAllByTestId('nudges')).toHaveLength(1);
    expect(screen.getAllByTestId('nudged-by')).toHaveLength(1);
  });
});
