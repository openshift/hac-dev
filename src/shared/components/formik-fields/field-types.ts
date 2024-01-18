import React from 'react';
import { ValidatedOptions, TextInputTypes, gridItemSpanValueShape } from '@patternfly/react-core';
import { SelectVariant } from '@patternfly/react-core/deprecated';
import { DropdownItemObject } from '../dropdown/BasicDropdown';
import { RowRendererProps } from './multi-column-field/MultiColumnFieldRow';

export interface FieldProps {
  name: string;
  label?: React.ReactNode;
  labelIcon?: React.ReactElement;
  helpText?: React.ReactNode;
  helpTextInvalid?: React.ReactNode;
  required?: boolean;
  style?: React.CSSProperties;
  isReadOnly?: boolean;
  disableDeleteRow?: boolean;
  disableAddRow?: boolean;
  className?: string;
  isDisabled?: boolean;
  validated?: ValidatedOptions;
  dataTest?: string;
}

export interface BaseInputFieldProps extends FieldProps {
  type?: TextInputTypes;
  placeholder?: string;
  onChange?: (event) => void;
  onBlur?: (event) => void;
  autoComplete?: string;
  autoFocus?: boolean;
  onKeyDown?: (event) => void;
}

export enum GroupTextType {
  TextInput = 'text',
  TextArea = 'textArea',
}

export interface GroupInputProps extends BaseInputFieldProps {
  beforeInput?: React.ReactNode;
  afterInput?: React.ReactNode;
  groupTextType?: GroupTextType;
}

export interface TextAreaProps extends FieldProps {
  placeholder?: string;
  onChange?: (event) => void;
  onBlur?: (event) => void;
  rows?: number;
  resizeOrientation?: 'vertical' | 'horizontal' | 'both';
}

export interface CheckboxFieldProps extends FieldProps {
  formLabel?: string;
  value?: string;
  onChange?: (val: boolean) => void;
}

export interface SwitchFieldProps extends CheckboxFieldProps {
  labelOff?: string;
}

export interface SearchInputFieldProps extends BaseInputFieldProps {
  onSearch: (searchTerm: string) => void;
}

export interface DropdownFieldProps extends FieldProps {
  value?: string;
  items: DropdownItemObject[];
  selectedKey?: string;
  recommended?: string;
  title?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  placeholder?: string;
  validateOnChange?: boolean;
  autocompleteFilter?: (text: string, item: object, key?: string) => boolean;
  onChange?: (value: string) => void;
  dropdownToggle?: (
    onToggle: (
      ev:
        | MouseEvent
        | TouchEvent
        | KeyboardEvent
        | React.KeyboardEvent<any>
        | React.MouseEvent<HTMLButtonElement>,
      isOpen: boolean,
    ) => void,
  ) => React.ReactElement;
}

export type FormSelectFieldOption<T = any> = {
  label: string;
  value: T;
  isPlaceholder?: boolean;
  isDisabled?: boolean;
};

export type FormSelectFieldProps = FieldProps & {
  isDisabled?: boolean;
  options: FormSelectFieldOption[];
  onChange?: (selectedValue: any) => void;
};

export interface ResourceLimitFieldProps extends FieldProps {
  unitName: string;
  unitOptions: object;
  fullWidth?: boolean;
  minValue?: number;
  maxValue?: number;
}

export interface MultiColumnFieldProps extends FieldProps {
  addLabel?: string;
  toolTip?: string;
  emptyValues: { [name: string]: string | boolean | string[] };
  emptyMessage?: string;
  headers: ({ name: string; required: boolean } | string)[];
  complexFields?: boolean[];
  children?: React.ReactNode;
  spans?: gridItemSpanValueShape[];
  rowRenderer?: (row: RowRendererProps) => React.ReactNode;
}

export interface NameValuePair {
  name: string;
  value: string;
}

export interface NameValueFromPair {
  name: string;
  valueFrom: ConfigMapKeyRef | SecretKeyRef;
}

export interface ConfigMapKeyRef {
  configMapKeyRef: {
    key: string;
    name: string;
  };
}

export interface SecretKeyRef {
  secretKeyRef: {
    key: string;
    name: string;
  };
}

export interface RadioButtonFieldProps extends FieldProps {
  value: React.ReactText;
  description?: React.ReactNode;
  onChange?: (value: React.ReactText) => void;
}

export interface RadioGroupFieldProps extends FieldProps {
  isInline?: boolean;
  options: RadioGroupOption[];
  onChange?: (value: React.ReactText) => void;
}

export interface RadioGroupOption {
  value: React.ReactText;
  label: React.ReactNode;
  isDisabled?: boolean;
  children?: React.ReactNode;
  activeChildren?: React.ReactElement;
}

export interface SelectInputOption {
  value: string;
  disabled?: boolean;
}

export interface SelectInputFieldProps extends FieldProps {
  variant?: SelectVariant;
  toggleId?: string;
  toggleAriaLabel?: string;
  onSelect?: (e: React.SyntheticEvent<HTMLElement>, selectedValue: any) => void;
  onClear?: () => void;
  options: SelectInputOption[];
  placeholderText?: React.ReactNode;
  isCreatable?: boolean;
  isInputValuePersisted?: boolean;
  hasOnCreateOption?: boolean;
}

export interface EnvironmentFieldProps extends FieldProps {
  envs?: (NameValuePair | NameValueFromPair)[];
  description?: string;
}

export interface KeyValueFieldProps extends FieldProps {
  entries?: { key: string; value: string }[];
  description?: string;
}

export interface NumberSpinnerFieldProps extends FieldProps {
  min?: number;
}
