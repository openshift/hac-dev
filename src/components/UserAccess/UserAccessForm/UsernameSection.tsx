import React from 'react';
import {
  Chip,
  ChipGroup,
  FormGroup,
  FormHelperText,
  FormSection,
  HelperText,
  HelperTextItem,
  TextInputGroup,
  TextInputGroupMain,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import { useField } from 'formik';
import HelpPopover from '../../../components/HelpPopover';
import { getFieldId } from '../../../shared';

import './UsernameSection.scss';

type Props = {
  disabled?: boolean;
};

export const UsernameSection: React.FC<Props> = ({ disabled }) => {
  const [, { value: usernames, error }, { setValue }] = useField<string[]>('usernames');
  const fieldId = getFieldId('usernames', 'input');
  const [fieldValue, setFieldValue] = React.useState('');

  return (
    <FormSection title="Add users">
      <FormGroup
        fieldId={fieldId}
        label="Enter usernames"
        labelIcon={
          <HelpPopover
            aria-label="Usernames in RHTAP"
            headerContent="Usernames in RHTAP"
            bodyContent="To find their username, the user you want to invite should log into RHTAP and click Workspaces. Their username is the first item in the breadcrumb navigation."
          />
        }
        isRequired
      >
        <TextInputGroup className="username-section" isDisabled={disabled}>
          <TextInputGroupMain
            type="search"
            placeholder="Enter username"
            data-test="username-input"
            aria-label="Enter username"
            value={fieldValue}
            onChange={(_, v) => setFieldValue(v)}
            onBlur={() => {
              if (fieldValue) {
                setValue([...usernames, fieldValue]);
                setFieldValue('');
              }
            }}
          >
            <ChipGroup>
              {usernames.map((name) => (
                <Chip
                  closeBtnAriaLabel="Remove"
                  key={name}
                  onClick={() => setValue(usernames.filter((n) => n !== name))}
                >
                  {name}
                </Chip>
              ))}
            </ChipGroup>
          </TextInputGroupMain>
        </TextInputGroup>
        <FormHelperText>
          <HelperText>
            {error ? (
              <HelperTextItem icon={<ExclamationCircleIcon />} variant="error">
                {error}
              </HelperTextItem>
            ) : (
              <HelperTextItem>
                Provide RHTAP usernames for the users you want to invite.
              </HelperTextItem>
            )}
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </FormSection>
  );
};
