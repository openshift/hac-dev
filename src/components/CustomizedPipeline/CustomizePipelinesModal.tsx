import { ModalVariant } from '@patternfly/react-core';
import { ComponentKind } from '../../types';
import { createModalLauncher } from '../modal/createModalLauncher';
import CustomizeAllPipelines from './CustomizeAllPipelines';
import CustomizeComponentPipeline from './CustomizeComponentPipeline';

export const createCustomizeAllPipelinesModalLauncher = (
  applicationName: string,
  namespace: string,
  filter?: (component: ComponentKind) => boolean,
  onClose?: () => void,
) =>
  createModalLauncher(CustomizeAllPipelines, {
    'data-testid': 'customized-all-pipelines-modal',
    variant: ModalVariant.large,
    hasNoBodyWrapper: true,
  })({ applicationName, namespace, filter, onClose });

export const createCustomizeComponentPipelineModalLauncher = (name: string, namespace: string) =>
  createModalLauncher(CustomizeComponentPipeline, {
    'data-testid': 'customized-pipelines-modal',
    variant: ModalVariant.large,
    hasNoBodyWrapper: true,
  })({ name, namespace });
