import * as React from 'react';
import { ExpandableSection, Stack, StackItem } from '@patternfly/react-core';
import { useField } from 'formik';
import { InputField } from '../../../shared';

const GitOptions: React.FC = () => {
  const [, { value: revision }] = useField<string>('source.git.revision');
  const [, { value: context }] = useField<string>('source.git.context');
  const [isExpanded, setIsExpanded] = React.useState<boolean>(!!(revision || context));

  return (
    <ExpandableSection
      isIndented
      toggleText="Git options"
      onToggle={(expanded: boolean) => {
        setIsExpanded(expanded);
      }}
      isExpanded={isExpanded}
    >
      <Stack style={{ maxWidth: '50%' }} hasGutter>
        <StackItem>
          <InputField
            name="source.git.revision"
            label="Git reference"
            helpText="Optional branch, tag or commit."
            data-test="git-reference"
          />
        </StackItem>
        <StackItem>
          <InputField
            name="source.git.context"
            label="Context dir"
            helpText="Optional subdirectory for the application source code."
            data-test="context-dir"
          />
        </StackItem>
      </Stack>
    </ExpandableSection>
  );
};

export default GitOptions;
