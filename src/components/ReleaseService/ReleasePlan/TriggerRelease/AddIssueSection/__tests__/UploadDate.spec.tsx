import * as React from 'react';
import '@testing-library/jest-dom';
import { act, configure, fireEvent, screen } from '@testing-library/react';
import { formikRenderer } from '../../../../../../utils/test-utils';
import UploadDate, { dateFormat } from '../UploadDate';

describe('UploadDate', () => {
  beforeEach(() => {
    configure({ testIdAttribute: 'data-test' });
  });

  it('dateFormat should format correct date', async () => {
    const formattedDate = dateFormat(new Date('10-03-2024'));
    expect(formattedDate).toEqual('10-03-2024');
  });

  it('should show datepicker with correct date', async () => {
    formikRenderer(<UploadDate name="app" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    // node.closest('input') not working
    const dateInput =
      screen.getByTestId('upload-date-input').children[0].children[0].children[0].children[0]
        .children[0];
    expect((dateInput as HTMLInputElement).value).toBe(dateFormat(new Date()));
  });

  it('should show label', async () => {
    formikRenderer(<UploadDate name="app" label="test-label" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    screen.getByText('test-label');
  });
});
