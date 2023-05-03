import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import TextColumnField from '../text-column-field/TextColumnField';

describe('TextColumnField', () => {
  it('should render TextColumnField with values, add and remove action', () => {
    formikRenderer(<TextColumnField label="Rows" name="rows" />, { rows: ['row-1', 'row-2'] });

    screen.getByDisplayValue('row-1');
    screen.getByDisplayValue('row-2');
    screen.getByText('Add values');
    expect(screen.queryByTestId('rows-0-remove-button')).toBeInTheDocument();
    expect(screen.queryByTestId('rows-1-remove-button')).toBeInTheDocument();
  });

  it('should enable drag and drop feature', () => {
    formikRenderer(<TextColumnField dndEnabled label="Rows" name="rows" />, {
      rows: ['row-1', 'row-2'],
    });
    expect(screen.queryAllByTestId('drag-and-drop-handle')).toHaveLength(2);
  });

  it('should add new row when add action is clicked', async () => {
    const onChange = jest.fn();
    formikRenderer(
      <TextColumnField
        dndEnabled
        label="Rows"
        name="rows"
        helpText="testing rows"
        onChange={onChange}
      />,
      {
        rows: ['row-1', 'row-2'],
      },
    );

    act(() => {
      fireEvent.click(screen.getByText('Add values'));
    });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
      expect(screen.queryAllByTestId('drag-and-drop-handle')).toHaveLength(3);
    });
  });
});
