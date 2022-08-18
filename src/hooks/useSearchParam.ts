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
      if (searchParams.get(name) !== newValue) {
        const newSearchParams = new URLSearchParams(searchParams);
        if (unsetWhenDefaultValue && newValue === defaultValueRef.current) {
          newSearchParams.delete(name);
        } else {
          newSearchParams.set(name, newValue);
        }
        setSearchParams(newSearchParams, { replace });
      }
    },
    [name, searchParams, setSearchParams, unsetWhenDefaultValue, replace],
  );

  const unset = React.useCallback(() => {
    if (searchParams.has(name)) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(name);
      setSearchParams(newSearchParams);
    }
  }, [name, searchParams, setSearchParams]);

  return [value, set, unset];
};
