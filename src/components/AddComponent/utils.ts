import * as React from 'react';
import { useFormikContext } from 'formik';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { useActiveNamespace } from '../../hooks/useActiveNamespace';
import { SPIAccessTokenBindingGroupVersionKind } from '../../models';
import { SPIAccessTokenBindingKind, SPIAccessTokenBindingPhase } from '../../types';

/**
 * Watch the SPIAccessTokenBinding resource and open auth window when provided.
 * Upon successful injection, set the specified secret.
 */
export const useAccessTokenBindingAuth = (name: string) => {
  const namespace = useActiveNamespace();
  const { setFieldValue } = useFormikContext();
  const [binding, loaded] = useK8sWatchResource<SPIAccessTokenBindingKind>({
    groupVersionKind: SPIAccessTokenBindingGroupVersionKind,
    name,
    namespace,
  });

  React.useEffect(() => {
    if (!name || !loaded) return;
    const oAuthUrl = binding.status?.oAuthUrl;
    if (oAuthUrl) {
      window.open(oAuthUrl);
    }
  }, [binding?.status?.oAuthUrl, loaded, name]);

  React.useEffect(() => {
    if (!name || !loaded) return;
    if (binding.status?.phase === SPIAccessTokenBindingPhase.Injected) {
      setFieldValue('git.authSecret', binding.status.syncedObjectRef.name);
    }
  }, [
    name,
    loaded,
    setFieldValue,
    binding?.status?.phase,
    binding?.status?.errorMessage,
    binding?.status?.syncedObjectRef?.name,
  ]);
};
