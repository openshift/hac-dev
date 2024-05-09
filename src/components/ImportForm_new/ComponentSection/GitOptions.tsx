import * as React from 'react';
import { ExpandableSection } from '@patternfly/react-core';
import HelpPopover from '../../HelpPopover';
import { InputField } from '../components/InputField';

const GitOptions: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <ExpandableSection
      toggleTextExpanded="Hide advanced Git options"
      toggleTextCollapsed="Show advanced Git options"
    >
      <InputField
        name="source.git.revision"
        label="Git reference"
        // helperText="Optional branch, tag or commit."
        data-test="git-reference"
      />

      <InputField
        name="source.git.context"
        label="Context directory"
        // helperText="Optional subdirectory for the application source code."
        data-test="context-dir"
        labelIcon={
          <HelpPopover bodyContent="Make sure this path is correct. You might get an error if your build context folder is your root directory but your Dockerfile is in a subdirectory of that folder." />
        }
      />
    </ExpandableSection>
  );
};

export default GitOptions;
