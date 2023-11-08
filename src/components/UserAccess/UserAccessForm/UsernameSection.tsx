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
import { useField } from 'formik';
import HelpPopover from '../../../components/HelpPopover';
import { resourceNameRegex } from '../../../components/ImportForm/utils/validation-utils';
import { getFieldId } from '../../../shared';
import { useDebounceCallback } from '../../../shared/hooks/useDebounceCallback';
import { validateUsername } from './form-utils';

import './UsernameSection.scss';

type Props = {
  disabled?: boolean;
};

export const UsernameSection: React.FC<Props> = ({ disabled }) => {
  const [, { value: usernames, error }, { setValue, setError }] = useField<string[]>('usernames');
  const fieldId = getFieldId('usernames', 'input');
  const [username, setUsername] = React.useState('');
  const [validHelpText, setValidHelpText] = React.useState('');
  const [validating, setValidating] = React.useState(false);

  const debouncedValidate = useDebounceCallback(
    React.useCallback(() => {
      setValidating(true);
      setValidHelpText('');
      setError('');
      if (!username) {
        setValidating(false);
        return;
      }
      if (!resourceNameRegex.test(username)) {
        setValidating(false);
        setError('Invalid username format.');
        return;
      }
      validateUsername(username).then((valid) => {
        setValidating(false);
        if (valid) {
          setError('');
          setValidHelpText('Validated');
          if (!usernames.includes(username)) {
            setValue([...usernames, username]);
          }
          setUsername('');
        } else {
          setError('Username not found.');
        }
      });
    }, [setError, setValue, username, usernames]),
  );

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
            value={username}
            onChange={(_, v) => {
              setUsername(v);
              debouncedValidate();
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
            {validating ? (
              <HelperTextItem variant="warning" hasIcon>
                Validating...
              </HelperTextItem>
            ) : error ? (
              <HelperTextItem variant="error" hasIcon>
                {error}
              </HelperTextItem>
            ) : validHelpText ? (
              <HelperTextItem variant="success" hasIcon>
                {validHelpText}
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
