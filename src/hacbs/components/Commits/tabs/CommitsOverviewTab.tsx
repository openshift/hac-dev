import * as React from 'react';
import { Button, PageSection, PageSectionVariants, Text } from '@patternfly/react-core';
import { Commit, PipelineRunKind } from '../../../types';
import CommitVisualization from './CommitDetails/CommitVisualization';

import './CommitsOverviewTab.scss';

type CommitsOverviewTabProps = {
  commit: Commit;
  onLearnMore: () => void;
  selectedPipelineRun?: PipelineRunKind;
};

const CommitOverviewTab: React.FC<CommitsOverviewTabProps> = ({ commit, onLearnMore }) => (
  <>
    <PageSection
      className="commit-overview"
      padding={{ default: 'noPadding' }}
      variant={PageSectionVariants.light}
      isFilled
    >
      <Text className="pf-u-mt-lg pf-u-mb-lg">
        Events progression triggered by the commit.
        <Button
          data-testid="hacbs-commit-overview-learn-more"
          variant="link"
          className="pf-u-pl-sm"
          onClick={onLearnMore}
        >
          Learn more
        </Button>
      </Text>
      <CommitVisualization commit={commit} />
    </PageSection>
  </>
);

export default CommitOverviewTab;
