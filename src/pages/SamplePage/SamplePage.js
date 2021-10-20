import React, { Suspense, lazy, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Button, StackItem, Stack, Title, Spinner } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const SampleComponent = lazy(() => import('../../components/SampleComponent/SampleComponent'));

import './SamplePage.scss';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
const SamplePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    insights?.chrome?.appAction?.('sample-page');
  }, []);

  const handleAlert = () => {
    dispatch(
      addNotification({
        variant: 'success',
        title: 'Hello World!!',
        description: 'This is a test notification.',
      }),
    );
  };

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="App Studio" />
        <p> HAC Developer Experience. </p>
      </PageHeader>
      <Main>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" size="3xl">
              {' '}
              Alerts{' '}
            </Title>
            <Button variant="primary" onClick={handleAlert}>
              {' '}
              Dispatch alert{' '}
            </Button>
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
        </Stack>
      </Main>
    </React.Fragment>
  );
};

export default withRouter(SamplePage);
