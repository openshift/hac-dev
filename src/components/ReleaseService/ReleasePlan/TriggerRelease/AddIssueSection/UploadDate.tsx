import * as React from 'react';
import { DatePicker, FormGroup } from '@patternfly/react-core';
import { useField } from 'formik';

type UploadDateProps = {
  name: string;
  label?: string;
};

export const dateFormat = (date: Date) =>
  date
    .toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\//g, '-');

const UploadDate: React.FC<React.PropsWithChildren<UploadDateProps>> = ({ name, label }) => {
  const [{ value = dateFormat(new Date()) }, , { setValue }] = useField<string>(name);

  const dateParse = (date: string) => {
    const split = date.split('-');
    if (split.length !== 3) {
      return new Date();
    }
    const month = split[0];
    const day = split[1];
    const year = split[2];
    return new Date(
      `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`,
    );
  };

  return (
    <FormGroup label={label}>
      <DatePicker
        data-test="upload-date-input"
        value={value}
        placeholder="MM-DD-YYYY"
        dateFormat={dateFormat}
        dateParse={dateParse}
        onChange={(event, val) => setValue(val)}
      />
    </FormGroup>
  );
};

export default UploadDate;
