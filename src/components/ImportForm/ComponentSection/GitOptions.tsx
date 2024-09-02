import * as React from 'react';
import { ExpandableSection, FormSection, PageSection } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { InputField } from 'formik-pf';
import gitUrlParse from 'git-url-parse';
import { detectGitType, GitProvider } from '../../../shared/utils/git-utils';
import { GIT_PROVIDER_ANNOTATION_VALUE } from '../../../utils/component-utils';
import HelpPopover from '../../HelpPopover';
import { ImportFormValues } from '../type';
import { GitProviderDropdown } from './GitProviderDropdown';

const GitOptions: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { values, errors, setFieldValue } = useFormikContext<ImportFormValues>();
  const [isGitAdvancedOpen, setGitAdvancedOpen] = React.useState<boolean>(false);

  const setGitURLAnnotation = React.useCallback(
    (url) => {
      let parsed: gitUrlParse.GitUrl;
      try {
        parsed = gitUrlParse(url);
        setFieldValue('gitURLAnnotation', parsed?.resource);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
    [setFieldValue],
  );

  React.useEffect(() => {
    setGitURLAnnotation(values.source?.git?.url);
    const gitType = detectGitType(values.source?.git?.url);
    if (gitType !== GitProvider.GITHUB && gitType !== GitProvider.GITLAB) {
      setFieldValue('gitProviderAnnotation', '');
      setGitAdvancedOpen(true);
    }
    if (gitType === GitProvider.GITHUB) {
      setFieldValue('gitProviderAnnotation', GIT_PROVIDER_ANNOTATION_VALUE.GITHUB);
    }
    if (gitType === GitProvider.GITLAB) {
      setFieldValue('gitProviderAnnotation', GIT_PROVIDER_ANNOTATION_VALUE.GITLAB);
    }
  }, [setGitURLAnnotation, values.source?.git?.url, setFieldValue, errors?.source?.git?.url]);
  return (
    <ExpandableSection
      toggleTextExpanded="Hide advanced Git options"
      toggleTextCollapsed="Show advanced Git options"
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
