import * as React from 'react';
import { ExpandableSection, FormSection, List, ListItem } from '@patternfly/react-core';
import { useField } from 'formik';
import HelpPopover from '../../../../components/HelpPopover';
import FormikParamsField from '../../../../components/IntegrationTest/FormikParamsField';
import { InputField, RadioGroupField, TextAreaField } from '../../../../shared';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';
import { ReleasePipelineLocation } from './form-utils';

const GitOptions: React.FC = () => {
  const [expanded, setExpanded] = React.useState(true);
  return (
    <>
      <InputField
        name="git.url"
        label="GitHub URL"
        placeholder="Example, https://github.com/tektoncd/catalog"
        helpText="The GitHub repository that contains the YAML definition of the pipeline run for your release service."
        required
      />
      <ExpandableSection
        toggleText="Git options"
        isExpanded={expanded}
        onToggle={(_, e) => setExpanded(e)}
        isIndented
      >
        <FormSection>
          <InputField
            name="git.revision"
            label="Revision"
            helpText="A Git revision commit SHA, branch, or tag to get a file from."
            required
          />
        </FormSection>
        <FormSection>
          <InputField
            name="git.path"
            label="Path in repository"
            helpText="How can we find the file in your repository?"
            required
          />
        </FormSection>
      </ExpandableSection>
    </>
  );
};

export const RunReleasePipelineSection: React.FC = () => {
  const [{ value: pipelineLocation }] =
    useField<ReleasePipelineLocation>('releasePipelineLocation');
  const { workspace } = useWorkspaceInfo();

  return (
    <>
      <RadioGroupField
        name="releasePipelineLocation"
        label="Where do you want to run the release pipeline?"
        options={[
          {
            value: ReleasePipelineLocation.current,
            label: `In the current workspace: ${workspace}`,
          },
          { value: ReleasePipelineLocation.target, label: 'In a target workspace' },
        ]}
        required
      />
      {pipelineLocation === ReleasePipelineLocation.current && (
        <>
          <GitOptions />
          <InputField
            name="serviceAccount"
            label="Service account"
            helpText="Which service account do you want to use to run your release pipeline?"
            labelIcon={
              <HelpPopover
                headerContent="Service account"
                bodyContent="Which service account do you want to use to run your release pipeline?"
              />
            }
            required
          />
          <FormikParamsField
            fieldName="params"
            heading=<>
              Parameters{' '}
              <HelpPopover
                headerContent="Parameters"
                bodyContent=<>
                  Add any of the following types of parameters:
                  <List>
                    <ListItem>url: The URL of the repo to fetch and clone anonymously.</ListItem>
                    <ListItem>repo: The repository to find the resource in.</ListItem>
                    <ListItem>org: The organization to find the repository in.</ListItem>
                    <ListItem>revision: Git revision to checkout a file from.</ListItem>
                    <ListItem>pathInRepo: Where to find the file in the repository.</ListItem>
                  </List>
                </>
              />
            </>
          />
        </>
      )}
      {pipelineLocation === ReleasePipelineLocation.target && (
        <>
          <InputField
            name="target"
            label="Target workspace"
            helpText="Type the workspace name that you would like the selected application to be released to"
            labelIcon={
              <HelpPopover
                headerContent="Target workspace"
                bodyContent="Your application will be released to the environments in this workspace."
              />
            }
            required
          />
          <GitOptions />
          <TextAreaField
            name="data"
            label="Data"
            helpText="Provide data related to a release pipeline."
          />
        </>
      )}
    </>
  );
};
