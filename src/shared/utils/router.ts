import { createBrowserHistory, createMemoryHistory, History } from 'history';
import each from 'lodash/each';
import startsWith from 'lodash/startsWith';

type AppHistory = History & { pushPath: History['push'] };

let createHistory;
const basePath = '/';

try {
  if (process.env.NODE_ENV === 'test') {
    // Running in node. Can't use browser history
    createHistory = createMemoryHistory;
  } else {
    createHistory = createBrowserHistory;
  }
} catch (unused) {
  createHistory = createBrowserHistory;
}

export const history: AppHistory = createHistory({ basename: basePath });

const removeBasePath = (url = '/') =>
  startsWith(url, basePath) ? url.slice(basePath.length - 1) : url;

// Monkey patch history to slice off the base path
(history as any).__replace__ = history.replace;
history.replace = (url) => (history as any).__replace__(removeBasePath(url as string));

(history as any).__push__ = history.push;
history.push = (url) => (history as any).__push__(removeBasePath(url as string));
(history as any).pushPath = (path) => (history as any).__push__(path);

export const getQueryArgument = (arg: string) =>
  new URLSearchParams(window.location.search).get(arg);

export const setQueryArgument = (k: string, v: string) => {
  const params = new URLSearchParams(window.location.search);
  if (params.get(k) !== v) {
    params.set(k, v);
    const url = new URL(window.location.href);
    history.replace(`${url.pathname}?${params.toString()}${url.hash}`);
  }
};

export const setQueryArguments = (newParams: { [k: string]: string }) => {
  const params = new URLSearchParams(window.location.search);
  let update = false;
  each(newParams, (v, k) => {
    if (params.get(k) !== v) {
      update = true;
      params.set(k, v);
    }
  });
  if (update) {
    const url = new URL(window.location.href);
    history.replace(`${url.pathname}?${params.toString()}${url.hash}`);
  }
};

export const setAllQueryArguments = (newParams: { [k: string]: string }) => {
  const params = new URLSearchParams();
  let update = false;
  each(newParams, (v, k) => {
    if (params.get(k) !== v) {
      update = true;
      params.set(k, v);
    }
  });
  if (update) {
    const url = new URL(window.location.href);
    history.replace(`${url.pathname}?${params.toString()}${url.hash}`);
  }
};

export const removeQueryArgument = (k: string) => {
  const params = new URLSearchParams(window.location.search);
  if (params.has(k)) {
    params.delete(k);
    const url = new URL(window.location.href);
    history.replace(`${url.pathname}?${params.toString()}${url.hash}`);
  }
};

export const removeQueryArguments = (...keys: string[]) => {
  const params = new URLSearchParams(window.location.search);
  let update = false;
  keys.forEach((k) => {
    if (params.has(k)) {
      update = true;
      params.delete(k);
    }
  });
  if (update) {
    const url = new URL(window.location.href);
    history.replace(`${url.pathname}?${params.toString()}${url.hash}`);
  }
};

export const setOrRemoveQueryArgument = (k: string, v: string) =>
  v ? setQueryArgument(k, v) : removeQueryArgument(k);
