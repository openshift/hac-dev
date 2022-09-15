import * as React from 'react';
import { Button, PageSection, PageSectionVariants, Text } from '@patternfly/react-core';
import { Commit } from '../../../types';
import { getCommitDisplayName } from '../../../utils/commits-utils';

type ApplicationOverviewTabProps = {
  commit: Commit;
  onLearnMore: () => void;
};

const ApplicationOverviewTab: React.FC<ApplicationOverviewTabProps> = ({ commit, onLearnMore }) => (
  <PageSection padding={{ default: 'noPadding' }} variant={PageSectionVariants.light} isFilled>
    <Text className="pf-u-mt-lg pf-u-mb-lg">
      Events progression triggered by the commit.
      <Button
        data-testid="hacbs-commit-overview-learn-more"
        variant="link"
        className="pf-u-pl-sm"
        onClick={onLearnMore}
      >
        read more
      </Button>
    </Text>
    <>Overview of {getCommitDisplayName(commit)}</>
  </PageSection>
);

export default ApplicationOverviewTab;
