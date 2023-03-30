import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import PageAccessCheck from '../components/PageAccess/PageAccessCheck';
import TaskRunView from '../components/TaskRunDetailsView/TaskRunDetailsView';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';
import { TaskRunModel } from '../models';
import { AccessReviewResources } from '../types';

const PipelineRunPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const name = params.trName;
  const accessReviewResources: AccessReviewResources = [{ model: TaskRunModel, verb: 'get' }];

  return (
    <NamespacedPage>
      <PageAccessCheck accessReviewResources={accessReviewResources}>
        {name && (
          <React.Fragment>
            <Helmet>
              <title>TaskRun details</title>
            </Helmet>
            <TaskRunView taskRunName={name} />
          </React.Fragment>
        )}
      </PageAccessCheck>
    </NamespacedPage>
  );
};

export default PipelineRunPage;
