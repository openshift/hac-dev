import React from 'react';
import { withRouter } from 'react-router-dom';
import { Spinner } from '@patternfly/react-core';
import { Formik, FormikProps } from 'formik';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

const SampleForm = React.lazy(() => import('../../components/SampleForm/SampleForm'));

const SampleFormPage: React.FC = () => {
  const initialValues = {
    textInput: '',
    checkbox: false,
    textAreaInput: '',
    dropdown: 'item1',
    fileUpload: {},
    multiColumnInput: undefined,
    multiColumnDropdown: '',
    multiColumnTextInput: '',
    formSelect: 'item1',
    inputGroup: '',
    numberSpinner: '',
    radioButton: '',
    radioGroup: '',
    selectInput: ['value1'],
    switch: '',
    textColumnField: [''],
  };

  const handleSubmit = () => {};

  const handleReset = () => {};

  const renderForm = (formikProps: FormikProps<any>) => (
    <SampleForm
      {...formikProps}
      heading="Sample Form"
      onReload={() => {}}
      handleCancel={() => {}}
    />
  );

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="App Studio" />
        <p> HAC Developer Experience. </p>
      </PageHeader>
      <Main>
        <React.Suspense fallback={<Spinner />}>
          <Formik initialValues={initialValues} onSubmit={handleSubmit} onReset={handleReset}>
            {renderForm}
          </Formik>
        </React.Suspense>
      </Main>
    </React.Fragment>
  );
};

export default withRouter(SampleFormPage);
