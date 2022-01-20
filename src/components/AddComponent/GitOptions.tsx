import * as React from 'react';
import { ExpandableSection, Stack, StackItem } from '@patternfly/react-core';
import { useField } from 'formik';
import { InputField } from '../../shared';

export const GitOptions: React.FC = () => {
  const [, { error }] = useField('source');
  if (error) {
    return null;
  }

  return (
    <ExpandableSection toggleText="Show options">
      <Stack style={{ maxWidth: '50%' }} hasGutter>
        <StackItem>
          <InputField
            name="git.reference"
            label="Git reference"
            helpText="Optional branch, tag or commit."
          />
        </StackItem>
        <StackItem>
          <InputField
            name="git.contextDir"
            label="Context dir"
            helpText="Optional subdirectory for the Application source code."
          />
        </StackItem>
      </Stack>
    </ExpandableSection>
  );
};
