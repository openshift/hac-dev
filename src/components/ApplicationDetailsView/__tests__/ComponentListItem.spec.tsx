import * as React from 'react';
import { configure, render, screen } from '@testing-library/react';
import { componentCRMocks } from '../__data__/mock-data';
import { ComponentListItem } from '../ComponentListItem';

configure({ testIdAttribute: 'data-testId' });

describe('ComponentListItem', () => {
  it('should render View Build logs item', () => {
    const { getByText } = render(
      <ComponentListItem
        component={componentCRMocks[0]}
        showLogsForComponent={() => {}}
        routes={[]}
      />,
    );
    screen.getByTestId('kebab-button').click();
    expect(getByText('View Build Logs')).not.toBeNull();
  });
});
