import React from 'react';
import { Helmet } from 'react-helmet';
import { AddComponentPage } from '../components/AddComponent/AddComponentPage';
import { ComponentSamplesPage } from '../components/ComponentSamples/ComponentSamplesPage';
import { CreateApplicationPage } from '../components/CreateApplication/CreateApplicationPage';
import { FormContextProvider } from '../components/form-context';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { ReviewComponentsPage } from '../components/ReviewComponents/ReviewComponentsPage';
import { Wizard } from '../components/Wizard/Wizard';
// import PageLayout from '../components/PageLayout/PageLayout';
// import ImportForm from '../components/ImportForm/ImportForm';

const ImportPage: React.FunctionComponent = () => {
  const title = 'Import your application';
  // const description = 'Enter an application name.';
  return (
    <NamespacedPage>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {/* <PageLayout title={title} description={description}>
        <ImportForm />
      </PageLayout> */}
      <FormContextProvider>
        <Wizard>
          <CreateApplicationPage />
          <AddComponentPage />
          <ComponentSamplesPage />
          <ReviewComponentsPage />
        </Wizard>
      </FormContextProvider>
    </NamespacedPage>
  );
};

export default ImportPage;
