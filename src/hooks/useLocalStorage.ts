import * as React from 'react';
import { seralizeData, deseralizeData } from '../utils/local-storage';

const localStorageKey = 'HAC_DEV_DATA';

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
  sync = false,
  session = false, // use sessionStorage if set to `true`
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  // Mount status for safty state updates
  const mounted = React.useRef(true);
  // React.useEffect(() => () => (mounted.current = false), []);

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const storage = session ? sessionStorage : localStorage;
  const keyRef = React.useRef(key);
  const defaultValueRef = React.useRef(defaultValue);
  const [data, setData] = React.useState(() => {
    const valueInStorage =
      storage.getItem(localStorageKey) !== null && deseralizeData(storage.getItem(localStorageKey));
    return valueInStorage &&
      valueInStorage[keyRef.current] &&
      valueInStorage[keyRef.current] !== undefined
      ? valueInStorage[keyRef.current]
      : defaultValueRef.current;
  });
  const dataRef = React.useRef<T>(data);
  dataRef.current = data;

  const storageUpdated = React.useCallback(
    (event: StorageEvent) => {
      if (mounted.current && event.storageArea === storage && event.key === localStorageKey) {
        const configMapData = deseralizeData(event.newValue);
        const newData = configMapData?.[keyRef.current];

        if (newData !== undefined && seralizeData(newData) !== seralizeData(dataRef.current)) {
          setData(newData);
        }
      }
    },
    [storage],
  );

  React.useEffect(() => {
    if (sync) {
      window.addEventListener('storage', storageUpdated);
    }
    return () => {
      if (sync) {
        window.removeEventListener('storage', storageUpdated);
      }
    };
  }, [storageUpdated, sync]);

  const updateData = React.useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (action: React.SetStateAction<T>) => {
      const previousData = dataRef.current;
      const newState =
        typeof action === 'function' ? (action as (prevState: T) => T)(previousData) : action;
      const lsData = deseralizeData(storage.getItem(localStorageKey)) ?? {};
      if (
        newState !== undefined &&
        seralizeData(newState) !== seralizeData(lsData?.[keyRef.current])
      ) {
        if (mounted.current) {
          setData(newState);
        }

        // Trigger update also when unmounted
        const dataToUpdate = {
          ...lsData,
          ...{
            [keyRef.current]: newState,
          },
        };
        const newValue = seralizeData(dataToUpdate);

        // create a storage event to dispatch locally since browser windows do not fire the
        // storage event if the change originated from the current window
        const event = new StorageEvent('storage', {
          storageArea: storage,
          key: localStorageKey,
          newValue,
          oldValue: storage.getItem(localStorageKey),
          url: window.location.toString(),
        });

        try {
          // update storage
          storage.setItem(localStorageKey, newValue);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(`Error while updating local storage for key ${localStorageKey}`, err);
        }

        // dispatch storage event
        window.dispatchEvent(event);
      }
    },
    [storage],
  );

  return [data, updateData];
};
