import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { ComponentGroupVersionKind } from '../../models';
import { ComponentKind } from '../../types';
import { ComponentProps } from '../modal/createModalLauncher';
import CustomizePipeline from './CustomizePipelines';

type Props = ComponentProps & {
  namespace: string;
  name: string;
};

const CustomizeComponentPipeline: React.FC<Props> = ({ namespace, name, onClose }) => {
  const [watchedComponent, loaded] = useK8sWatchResource<ComponentKind>({
    groupVersionKind: ComponentGroupVersionKind,
    namespace,
    name,
    isList: false,
  });
  if (loaded && watchedComponent) {
    return <CustomizePipeline components={[watchedComponent]} onClose={onClose} />;
  }
  return null;
};

export default CustomizeComponentPipeline;
