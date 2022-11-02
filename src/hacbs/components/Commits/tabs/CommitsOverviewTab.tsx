import * as React from 'react';
import { Button, PageSection, PageSectionVariants, Text } from '@patternfly/react-core';
import { Commit, PipelineRunKind } from '../../../types';
import { getCommitDisplayName } from '../../../utils/commits-utils';

type CommitOverviewTabProps = {
  commit: Commit;
  onLearnMore: () => void;
  selectedPipelineRun: PipelineRunKind;
};

const CommitOverviewTab: React.FC<CommitOverviewTabProps> = ({
  commit,
  onLearnMore,
  selectedPipelineRun,
}) => (
  <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
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
    <>Overview of {getCommitDisplayName(commit)}</>
    {selectedPipelineRun && <div>selected:{selectedPipelineRun.metadata.name}</div>}
  </PageSection>
);

export default CommitOverviewTab;
