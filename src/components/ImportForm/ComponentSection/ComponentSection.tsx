import * as React from 'react';
import { FormSection, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { InputField } from 'formik-pf';
import GitRepoLink from '../../GitLink/GitRepoLink';
import { ImportFormValues } from '../type';
import { SourceSection } from './SourceSection';

export const ComponentSection = () => {
  const { values } = useFormikContext<ImportFormValues>();
  return (
    <FormSection>
      <TextContent>
        <Text component={TextVariants.h3}>Component details</Text>
        <Text component={TextVariants.p}>
          A component is an image built from source code repository.
        </Text>
      </TextContent>
      <SourceSection />
      <InputField
        name="source.git.dockerfileUrl"
        label="Docker file"
        placeholder="/path/to/Dockerfile"
      />
      <InputField
        name="componentName"
        label="Component name"
        isRequired
        data-testid="component-name"
      />
      {values.source.git.url ? (
        <GitRepoLink
          url={values.source.git.url}
          revision={values.source.git.revision}
          context={values.source.git.context}
        />
      ) : null}
    </FormSection>
  );
};
