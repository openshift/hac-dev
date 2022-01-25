import * as React from 'react';
import { CatalogItem } from '../shared/components/catalog/utils/types';

type ComponentData = {
  source: string;
  contextDir?: string;
  targetPort?: number;
  replicas?: number;
  route?: string;
  resources?: {
    memory?: string;
    cpu?: string;
  };
};

type S = {
  workspace?: string;
  namespace?: string;
  application?: string;
  existingApplication?: string;
  source?: string;
  components?: CatalogItem<ComponentData>[];
  isMultiComponent?: boolean;
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
