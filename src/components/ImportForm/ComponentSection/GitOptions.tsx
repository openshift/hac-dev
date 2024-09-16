import * as React from 'react';
import { ExpandableSection, FormSection, PageSection } from '@patternfly/react-core';
import { InputField } from 'formik-pf';
import HelpPopover from '../../HelpPopover';
import { GitProviderDropdown } from './GitProviderDropdown';

type GitOptionProps = {
  isGitAdvancedOpen: boolean;
  setGitAdvancedOpen: (x) => void;
};

const GitOptions: React.FC<React.PropsWithChildren<GitOptionProps>> = ({
  isGitAdvancedOpen,
  setGitAdvancedOpen,
}) => {
  return (
    <ExpandableSection
      toggleTextExpanded="Hide advanced Git options"
      toggleTextCollapsed="Show advanced Git options"
      data-test="advanced-git-options"
      isExpanded={isGitAdvancedOpen}
      onToggle={() => setGitAdvancedOpen((x) => !x)}
    >
      <PageSection>
        <FormSection>
          <InputField
            name="source.git.revision"
            label="Git reference"
            helperText="Optional branch, tag or commit."
            data-testid="git-reference"
          />

          <InputField
            name="source.git.context"
            label="Context directory"
            helperText="Optional subdirectory for the application source code."
            data-testid="context-dir"
            labelIcon={
              <HelpPopover bodyContent="Make sure this path is correct. You might get an error if your build context folder is your root directory but your Dockerfile is in a subdirectory of that folder." />
            }
          />
          <GitProviderDropdown name="gitProviderAnnotation" />
          <InputField
            name="gitURLAnnotation"
            label="Git url annotation"
            data-test="url-annotation"
          />
        </FormSection>
      </PageSection>
    </ExpandableSection>
  );
};

export default GitOptions;
