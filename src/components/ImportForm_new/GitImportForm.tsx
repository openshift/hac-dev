import * as React from 'react';
import { Form, PageSection } from '@patternfly/react-core';
import { Formik } from 'formik';
import ApplicationSection from './ApplicationSection/ApplicationSection';
import { ComponentSection } from './ComponentSection/ComponentSection';
import GitImportActions from './GitImportActions';
import { PipelineSection } from './PipelineSection/PipelineSection';
import { ImportFormValues } from './type';

export const GitImportForm: React.FC<{ applicationName: string }> = ({ applicationName }) => {
  const initialValues: ImportFormValues = {
    application: applicationName || '',
    inAppContext: !!applicationName,
    showComponent: !!applicationName,
    componentName: '',
    source: {
      git: {
        url: '',
      },
    },
    pipeline: {
      name: '',
    },
  };

  const handleSubmit = React.useCallback(() => {}, []);
  const handleReset = React.useCallback(() => {}, []);

  return (
    <Formik<ImportFormValues>
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {(formikProps) => {
        return (
          <Form
            onSubmit={formikProps.handleSubmit}
            onReset={formikProps.handleReset}
            isWidthLimited
          >
            <PageSection>
              <ApplicationSection />
              {formikProps.values.showComponent ? (
                <>
                  <ComponentSection />
                  <PipelineSection />
                </>
              ) : null}
            </PageSection>
            <GitImportActions />
          </Form>
        );
      }}
    </Formik>
  );
};
