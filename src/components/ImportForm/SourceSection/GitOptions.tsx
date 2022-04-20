import * as React from 'react';
import { ExpandableSection, Stack, StackItem } from '@patternfly/react-core';
import { InputField } from '../../../shared';

const GitOptions: React.FC = () => (
  <ExpandableSection isIndented toggleText="Git options">
    <Stack style={{ maxWidth: '50%' }} hasGutter>
      <StackItem>
        <InputField
          name="git.ref"
          label="Git reference"
          helpText="Optional branch, tag or commit."
          data-test="git-reference"
        />
      </StackItem>
      <StackItem>
        <InputField
          name="git.context"
          label="Context dir"
          helpText="Optional subdirectory for the application source code."
          data-test="context-dir"
        />
      </StackItem>
    </Stack>
  </ExpandableSection>
);

export default GitOptions;
