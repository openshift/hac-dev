import * as React from 'react';
import { ExpandableSection, Stack, StackItem } from '@patternfly/react-core';
import { CheckboxField, InputField } from '../../shared';

export const GitOptions: React.FC = () => (
  <ExpandableSection toggleText="Authorization and Git options">
    <Stack style={{ maxWidth: '50%', marginLeft: '2em' }} hasGutter>
      <StackItem>
        <CheckboxField
          name="git.isMultiComponent"
          label="Multi Component"
          helpText="Whether the source contains multiple components."
        />
      </StackItem>
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
          helpText="Optional subdirectory for the application source code."
        />
      </StackItem>
    </Stack>
  </ExpandableSection>
);
