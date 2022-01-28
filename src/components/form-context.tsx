import * as React from 'react';
import { CatalogItem } from '../shared/components/catalog/utils/types';

type ComponentData = {
  source: string;
  reference?: string;
  contextDir?: string;
  targetPort?: number;
  language?: string;
  projectType?: string;
  resources?: {
    memory: string;
    cpu: string;
  };
};

type S = {
  workspace?: string;
  namespace?: string;
  application?: string;
  existingApplication?: string;
  source?: string;
  components?: CatalogItem<ComponentData>[];
};

const FormContext = React.createContext<[S, React.Dispatch<React.SetStateAction<S>>]>([
  {},
  () => {},
]);

export const FormContextProvider = ({ children }) => {
  const [formValues, setFormValues] = React.useState<S>({});

  return (
    <FormContext.Provider value={[formValues, setFormValues]}>{children}</FormContext.Provider>
  );
};

export const useFormValues = () => React.useContext(FormContext);
