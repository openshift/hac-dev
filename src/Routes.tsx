import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { SamplesFlow } from './components/SamplesFlow';

const SampleFormPage = lazy(
  () => import(/* webpackChunkName: "SampleFormPage" */ './pages/SampleForm/SampleFormPage'),
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
      <Route path="/sample-form" component={SampleFormPage} exact />
      {/* Finally, catch all unmatched routes */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </Suspense>
);
