import React, { Suspense, lazy, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, StackItem, Stack, Title, Spinner, PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

const SampleComponent = lazy(() => import('../../components/SampleComponent/SampleComponent'));

import './SamplePage.scss';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
const SamplePage: React.FC = () => {
  useEffect(() => {
    window.insights?.chrome?.appAction?.('sample-page');
  }, []);

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="App Studio" />
        <p> HAC Developer Experience. </p>
      </PageHeader>
      <PageSection>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" size="3xl">
              {' '}
              Alerts{' '}
            </Title>
            <Button variant="primary"> Dispatch alert </Button>
          </StackItem>
          <StackItem>
            <Suspense fallback={<Spinner />}>
              <SampleComponent>
                <h1>
                  This is a sample component which takes childrens and renders it. Just like this
                  header text.
                </h1>
              </SampleComponent>
            </Suspense>
          </StackItem>
          <StackItem>
            <Link to="/app-studio/k8s-util">K8s Util Test</Link>
          </StackItem>
        </Stack>
      </PageSection>
    </React.Fragment>
  );
};

export default withRouter(SamplePage);
