import * as React from 'react';
import { ExpandableSection, Stack, StackItem } from '@patternfly/react-core';
import { CheckboxField, InputField } from '../../shared';

export const GitOptions: React.FC = () => (
  <ExpandableSection isIndented toggleText="Git options">
    <Stack style={{ maxWidth: '50%' }} hasGutter>
      <StackItem>
        <InputField
          name="git.reference"
          label="Git reference"
          helpText="Optional branch, tag or commit."
          data-test="git-reference"
        />
      </StackItem>
      <StackItem>
        <InputField
          name="git.contextDir"
          label="Context dir"
          helpText="Optional subdirectory for the application source code."
          data-test="context-dir"
        />
      </StackItem>
      <StackItem>
        <CheckboxField
          name="git.isMultiComponent"
          label="Multi Component"
          helpText="Whether the source contains multiple components."
        />
      </StackItem>
    </Stack>
  </ExpandableSection>
);
