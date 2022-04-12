import { useState, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { extensions } from '../../../config/remotePlugin';

const ROUTE_TYPE = 'console.page/route';

export type useParamsHook<Params extends { [K in keyof Params]?: string } = {}> = () => Params;
type matchReduce<Params extends { [K in keyof Params]?: string } = {}> = (location: {
  pathname: string;
}) => (
  acc: { params: Params } | null,
  extension: {
    type: string;
    properties: { path?: string; exact?: boolean };
  },
  index: number,
  array: Array<unknown>,
) => {
  params: Params;
} | null;

const matcher: matchReduce =
  (location) =>
  (acc, { type, properties: { path, exact } }, index, array) => {
    // when we find matching path skip rest of the reducer
    if (acc?.params) {
      array.splice(index);
    }
    // try to match only ROUTE_TYPE, if not correct type or not found return acc
    return type === ROUTE_TYPE ? matchPath(location.pathname, { path, exact }) || acc : acc;
  };

/** Custom hook to find params of matched pathname to any remotePlugin extensions. */
export const useParams: useParamsHook = () => {
  const location = useLocation();
  const [params, setParams] = useState<unknown | undefined>();
  useEffect(() => {
    if (location) {
      const matched = extensions.slice(0).reduce(matcher(location), null);
      setParams(matched?.params);
    }
  }, [location]);
  return params;
};
