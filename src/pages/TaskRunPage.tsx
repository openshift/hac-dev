import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import TaskRunView from '../components/TaskRunDetailsView/TaskRunDetailsView';
import { useQuickstartCloseOnUnmount } from '../hooks/useQuickstartCloseOnUnmount';

const PipelineRunPage = () => {
  useQuickstartCloseOnUnmount();
  const params = useParams();
  const name = params.trName;

  return (
    <NamespacedPage>
      {name && (
        <React.Fragment>
          <Helmet>
            <title>TaskRun details</title>
          </Helmet>
          <TaskRunView taskRunName={name} />
        </React.Fragment>
      )}
    </NamespacedPage>
  );
};

export default PipelineRunPage;
