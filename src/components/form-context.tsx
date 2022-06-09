import * as React from 'react';
import { CatalogItem } from '../shared/components/catalog/utils/types';
import { ComponentSource } from '../types';
import { AddComponentValues } from './AddComponent/AddComponentForm';

export type ComponentData = {
  source: ComponentSource;
  contextDir?: string;
  targetPort?: number;
  replicas?: number;
  route?: string;
  resources?: { limits?: { cpu?: string; memory?: string } };
  env?: { name: string; value: string }[];
};

export type DetectedComponentData = CatalogItem<ComponentData>;

export type FormState = {
  workspace?: string;
  namespace?: string;
  application?: string;
  existingApplication?: string;
  source?: string;
  git?: AddComponentValues['git'];
  components?: CatalogItem<ComponentData>[];
  isMultiComponent?: boolean;
};

const FormContext = React.createContext<
  [FormState, React.Dispatch<React.SetStateAction<FormState>>]
>([{}, () => {}]);

export const FormContextProvider = ({ children }) => {
  const [formValues, setFormValues] = React.useState<FormState>({});

  return (
    <FormContext.Provider value={[formValues, setFormValues]}>{children}</FormContext.Provider>
  );
};

export const useFormValues = () => React.useContext(FormContext);
