import React from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Manage search param state reactively with react-router.
 *
 * Options:
 *  - `unsetWhenDefaultValue`: if `true` the search param will be removed if the set value is equal the default value
 */
export const useSearchParam = (
  name: string,
  defaultValue: string = null,
  options?: {
    replace?: boolean;
    unsetWhenDefaultValue?: boolean;
  },
): [string, (newValue: string) => void, () => void] => {
  const defaultValueRef = React.useRef(defaultValue);
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.has(name) ? searchParams.get(name) : defaultValueRef.current;
  const unsetWhenDefaultValue = options?.unsetWhenDefaultValue ?? true;
  const replace = options?.replace ?? true;
  const set = React.useCallback(
    (newValue: string) => {
      const newSearchParams = new URLSearchParams(window.location.search);
      if (newSearchParams.get(name) !== newValue) {
        if (unsetWhenDefaultValue && newValue === defaultValueRef.current) {
          newSearchParams.delete(name);
        } else {
          newSearchParams.set(name, newValue);
        }
        setSearchParams(newSearchParams, { replace });
      }
    },
    [name, setSearchParams, unsetWhenDefaultValue, replace],
  );

  const unset = React.useCallback(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    if (newSearchParams.has(name)) {
      newSearchParams.delete(name);
      setSearchParams(newSearchParams);
    }
  }, [name, setSearchParams]);

  return [value, set, unset];
};
