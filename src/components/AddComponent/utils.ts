import * as React from 'react';
import { useFormikContext } from 'formik';
import { useK8sWatchResource } from '../../dynamic-plugin-sdk';
import { SPIAccessTokenBindingGroupVersionKind } from '../../models';
import { SPIAccessTokenBindingKind, SPIAccessTokenBindingPhase } from '../../types';
import { NamespaceContext } from './../NamespacedPage/NamespacedPage';

/**
 * Watch the SPIAccessTokenBinding resource and open auth window when provided.
 * Upon successful injection, set the specified secret.
 */
export const useAccessTokenBindingAuth = (name: string) => {
  const { namespace } = React.useContext(NamespaceContext);
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
      // eslint-disable-next-line no-console
      console.log('Git repository successfully authorized.');
    } else if (binding.status?.phase === SPIAccessTokenBindingPhase.Error) {
      // eslint-disable-next-line no-console
      console.log('Error in binding status ', binding.status.errorMessage);
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
