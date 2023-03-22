import * as React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Text,
} from '@patternfly/react-core';
import CommitLabel from '../../../shared/components/commit-label/CommitLabel';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { Timestamp } from '../../../shared/components/timestamp/Timestamp';
import { Commit } from '../../../types';
import { createRepoBranchURL, createRepoPullRequestURL } from '../../../utils/commits-utils';
import { runStatus } from '../../../utils/pipeline-utils';
import { StatusIconWithTextLabel } from '../../topology/StatusIcon';
import CommitVisualization from '../CommitDetails/visualization/CommitVisualization';

import './CommitsOverviewTab.scss';

type CommitsOverviewTabProps = {
  commit: Commit;
  commitStatus: string;
};

const CommitOverviewTab: React.FC<CommitsOverviewTabProps> = ({ commit, commitStatus }) => (
  <>
    <Text className="pf-u-my-lg">Events progression triggered by the commit.</Text>
    <CommitVisualization commit={commit} />
    <Flex className="pf-u-py-lg">
      <FlexItem flex={{ default: 'flex_3' }}>
        <DescriptionList
          data-test="commit-details"
          columnModifier={{
            default: '1Col',
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>Commit</DescriptionListTerm>
            <DescriptionListDescription>
              <CommitLabel
                gitProvider={commit.gitProvider}
                sha={commit.sha}
                shaURL={commit.shaURL}
              />
            </DescriptionListDescription>
          </DescriptionListGroup>
          {commit.isPullRequest ? (
            <DescriptionListGroup>
              <DescriptionListTerm>Pull request</DescriptionListTerm>
              <DescriptionListDescription>
                {createRepoPullRequestURL(commit) ? (
                  <ExternalLink
                    href={createRepoPullRequestURL(commit)}
                    text={`${commit.pullRequestNumber}`}
                  />
                ) : (
                  commit.pullRequestNumber
                )}
              </DescriptionListDescription>
            </DescriptionListGroup>
          ) : null}
          <DescriptionListGroup>
            <DescriptionListTerm>Branch</DescriptionListTerm>
            <DescriptionListDescription>
              {createRepoBranchURL(commit) ? (
                <ExternalLink href={createRepoBranchURL(commit)} text={`${commit.branch}`} />
              ) : (
                `${commit.branch}`
              )}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>By</DescriptionListTerm>
            <DescriptionListDescription>{commit.user}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Created at</DescriptionListTerm>
            <DescriptionListDescription>
              <Timestamp timestamp={commit.creationTime} />
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </FlexItem>
      <Flex flex={{ default: 'flex_3' }}>
        <FlexItem flex={{ default: 'flex_3' }}>
          <DescriptionList
            data-test="commit-details"
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>Status</DescriptionListTerm>
              <DescriptionListDescription>
                <StatusIconWithTextLabel status={commitStatus as runStatus} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>Component</DescriptionListTerm>
              <DescriptionListDescription>
                {commit.components.map((component, index) => {
                  return (
                    <>
                      {component}
                      {index < commit.components.length - 1 && ','}
                    </>
                  );
                })}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </FlexItem>
      </Flex>
    </Flex>
  </>
);

export default CommitOverviewTab;
