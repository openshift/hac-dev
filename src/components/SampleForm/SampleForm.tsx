import { FormSection, InputGroupText, TextInputTypes } from '@patternfly/react-core';
import { AtIcon } from '@patternfly/react-icons/dist/esm/icons/at-icon';
import { FormikProps, FormikValues } from 'formik';
import React from 'react';
import { DropdownItemObject } from '../../shared/components/dropdown/BasicDropdown';
import {
  FlexForm,
  FormBody,
  FormFooter,
  FormHeader,
} from '../../shared/components/form-components';
import {
  CheckboxField,
  DropdownField,
  FileUploadField,
  FormSelectField,
  FormSelectFieldOption,
  InputField,
  InputGroupField,
  MultiColumnField,
  NumberSpinnerField,
  RadioButtonField,
  RadioGroupField,
  SelectInputField,
  SwitchField,
  TextAreaField,
  TextColumnField,
} from '../../shared/components/formik-fields';

import './SampleForm.scss';

type SampleFormProps = {
  heading: string;
  onReload: () => void;
  handleCancel: () => void;
  handleDownload?: () => void;
  disableSubmit?: boolean;
};

const SampleForm: React.FC<FormikProps<FormikValues> & SampleFormProps> = ({
  heading,
  handleSubmit,
  onReload,
  handleDownload,
  status,
  isSubmitting,
  handleCancel,
  disableSubmit,
}) => {
  const dropdownItems: DropdownItemObject[] = [
    { key: 'item1', value: 'item1' },
    { key: 'item2', value: 'item2' },
    { key: 'item3', value: 'item3' },
  ];

  const formSelectOptions: FormSelectFieldOption[] = [
    { value: 'item1', label: 'item1' },
    { value: 'item2', label: 'item2' },
    { value: 'item3', label: 'item3' },
  ];

  return (
    <div className="hacDev-sample-form">
      <FlexForm onSubmit={handleSubmit} isWidthLimited>
        <FormBody flexLayout>
          <FormHeader title={heading} />
          <InputField
            name="textInput"
            label="Text Input Field"
            helpText="Sample text input field"
          />
          <CheckboxField name="checkbox" label="Checkbox Field" helpText="Sample checkbox field" />
          <TextAreaField
            name="textAreaInput"
            label="Text Area Input Field"
            helpText="Sample text area input field"
          />
          <DropdownField
            name="dropdown"
            items={dropdownItems}
            label="Dropdown Field"
            helpText="Sample dropdown field"
            fullWidth
          />
          <FileUploadField
            id="fileUpload"
            name="fileUpload"
            label="File Upload Field"
            helpText="Sample file upload field"
          />
          <FormSection title="Multi Column Field">
            <MultiColumnField
              name="multiColumnInput"
              addLabel="Add row"
              headers={['Name', 'Value']}
              emptyValues={{ multiColumnDropdown: 'item1', multiColumnTextInput: '' }}
            >
              <DropdownField
                name="multiColumnDropdown"
                items={dropdownItems}
                label="Column 1"
                fullWidth
              />
              <InputField name="multiColumnTextInput" label="Column 2" />
            </MultiColumnField>
          </FormSection>
          <FormSelectField name="formSelect" options={formSelectOptions} label="Form Select" />
          <InputGroupField
            type={TextInputTypes.email}
            name="inputGroup"
            label="Input Group"
            helpText="Sample input group field"
            afterInput={<InputGroupText>{'@example.com'}</InputGroupText>}
            beforeInput={
              <InputGroupText>
                <AtIcon />
              </InputGroupText>
            }
            style={{ maxWidth: '100%' }}
          />
          <NumberSpinnerField name="numberSpinner" label="Number Spinner" />
          <RadioButtonField name="radioButton" label="Radio Button" value="value" />
          <RadioGroupField
            label="Radio Group"
            name="radioGroup"
            options={[
              {
                label: 'option1',
                value: 'value1',
              },
              {
                label: 'option2',
                value: 'value2',
              },
              {
                label: 'option3',
                value: 'value3',
                isDisabled: true,
              },
            ]}
            isInline
          />
          <SelectInputField
            name="selectInput"
            label="Select Input"
            options={[
              { value: 'value1', disabled: false },
              { value: 'value2', disabled: false },
              { value: 'value3', disabled: true },
            ]}
          />
          <SwitchField name="switch" label="Switch" />
          <TextColumnField name="textColumnField" label="Text Column Field" dndEnabled />
        </FormBody>
        <FormFooter
          handleReset={onReload}
          errorMessage={status?.submitError}
          successMessage={status?.submitSuccess}
          infoTitle="This object has been updated."
          infoMessage="Click reload to see the new version."
          isSubmitting={isSubmitting}
          submitLabel="Save"
          resetLabel="Reset"
          cancelLabel="Cancel"
          disableSubmit={disableSubmit}
          handleCancel={handleCancel}
          handleDownload={handleDownload}
          sticky
        />
      </FlexForm>
    </div>
  );
};

export default SampleForm;
