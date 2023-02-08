import * as React from 'react';
import { PageSection, PageSectionVariants, Text } from '@patternfly/react-core';
import { Commit, PipelineRunKind } from '../../../types';
import CommitVisualization from './CommitDetails/CommitVisualization';

import './CommitsOverviewTab.scss';

type CommitsOverviewTabProps = {
  commit: Commit;
  selectedPipelineRun?: PipelineRunKind;
};

const CommitOverviewTab: React.FC<CommitsOverviewTabProps> = ({ commit }) => (
  <>
    <PageSection
      className="commit-overview"
      padding={{ default: 'noPadding' }}
      variant={PageSectionVariants.light}
      isFilled
    >
      <Text className="pf-u-mt-lg pf-u-mb-lg">Events progression triggered by the commit.</Text>
      <CommitVisualization commit={commit} />
    </PageSection>
  </>
);

export default CommitOverviewTab;
