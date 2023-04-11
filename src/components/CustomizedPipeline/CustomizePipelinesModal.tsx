import { ModalVariant } from '@patternfly/react-core';
import { ComponentKind } from '../../types';
import { createRawModalLauncher } from '../modal/createModalLauncher';
import CustomizeAllPipelines from './CustomizeAllPipelines';
import CustomizeComponentPipeline from './CustomizeComponentPipeline';

export const createCustomizeAllPipelinesModalLauncher = (
  applicationName: string,
  namespace: string,
  filter?: (component: ComponentKind) => boolean,
  onClose?: () => void,
) =>
  createRawModalLauncher(CustomizeAllPipelines, {
    'data-testid': 'customized-all-pipelines-modal',
    variant: ModalVariant.large,
    hasNoBodyWrapper: true,
    onClose,
  })({ applicationName, namespace, filter });

export const createCustomizeComponentPipelineModalLauncher = (name: string, namespace: string) =>
  createRawModalLauncher(CustomizeComponentPipeline, {
    'data-testid': 'customized-pipelines-modal',
    variant: ModalVariant.large,
    hasNoBodyWrapper: true,
  })({ name, namespace });
