import * as React from 'react';
import { AddComponentPage } from './AddComponent/AddComponentPage';
import { ComponentSamplesPage } from './ComponentSamples/ComponentSamplesPage';
import { CreateApplicationPage } from './CreateApplication/CreateApplicationPage';
import { FormContextProvider } from './form-fields/form-context';
import { ReviewComponentsPage } from './ReviewComponents/ReviewComponentsPage';
import { Wizard } from './Wizard/Wizard';

export const SamplesFlow: React.FC = () => {
  return (
    <FormContextProvider>
      <Wizard>
        <CreateApplicationPage />
        <AddComponentPage />
        <ComponentSamplesPage />
        <ReviewComponentsPage />
      </Wizard>
    </FormContextProvider>
  );
};
