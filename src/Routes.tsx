import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';

const SamplePage = lazy(
  () => import(/* webpackChunkName: "SamplePage" */ './pages/SamplePage/SamplePage'),
);

const K8sPage = lazy(() => import(/* webpackChunkName: "K8sPage" */ './pages/TestK8s'));

const SamplesFlow = lazy(
  () => import(/* webpackChunkName: "SamplesFlow" */ './components/SamplesFlow'),
);

const ComponentListView = lazy(
  () =>
    import(
      /* webpackChunkName: "ComponentListView" */ './components/ComponentListView/ComponentListView'
    ),
);

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes: React.FC = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <Switch>
      <Route path="/" component={SamplesFlow} exact />
      <Route path="/components" component={ComponentListView} exact />
      <Route path="/sample-page" component={SamplePage} exact />
      <Route path="/k8s-util" component={K8sPage} exact />
      {/* Finally, catch all unmatched routes */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </Suspense>
);
