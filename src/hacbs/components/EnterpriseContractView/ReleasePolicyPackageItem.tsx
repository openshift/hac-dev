import * as React from 'react';
import {
  DataList,
  DataListCell,
  DataListItemCells,
  DataListItem,
  DataListItemRow,
  DataListToggle,
  DataListContent,
  DescriptionList,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { BASE_INFO_URL } from './const';
import { ReleaseAnnotation, ReleasePackageInfo } from './types';

import './ReleasePolicyPackageItem.scss';

type ReleasePolicyPackageItemProps = {
  releasePackageInfo: ReleasePackageInfo;
  releasePackageAnnotations: ReleaseAnnotation[];
};

const ReleasePolicyPackageItem: React.FC<ReleasePolicyPackageItemProps> = ({
  releasePackageInfo,
  releasePackageAnnotations,
}) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  return (
    <div className="release-policy-item">
      <DataList aria-label="release policies listing" className="release-policy-item__list">
        <DataListItem
          aria-label={releasePackageInfo.title}
          isExpanded={expanded}
          data-testid={`release-package-item-${releasePackageInfo.shortName}`}
          className="release-policy-item__package"
        >
          <DataListItemRow>
            <DataListToggle
              id={releasePackageInfo.shortName}
              data-testid={`${releasePackageInfo.shortName}-toggle`}
              onClick={() => setExpanded((x) => !x)}
              isExpanded={expanded}
            />
            <DataListItemCells
              dataListCells={[
                <DataListCell key="name">
                  <ExternalLink href={`${BASE_INFO_URL}#${releasePackageInfo.shortName}_package`}>
                    {releasePackageInfo.title} <ExternalLinkAltIcon />
                  </ExternalLink>
                </DataListCell>,
              ]}
            />
          </DataListItemRow>
          <DataListContent aria-label={`${releasePackageInfo.title} details`} isHidden={!expanded}>
            <DescriptionList isCompact className="release-policy-item__package-details">
              {releasePackageAnnotations?.map((annotation) => (
                <ExternalLink
                  key={annotation.shortName}
                  additionalClassName="release-policy-item__package-annotation-link"
                  href={`${BASE_INFO_URL}#${annotation.shortName}`}
                >
                  {annotation.title} <ExternalLinkAltIcon />
                </ExternalLink>
              ))}
            </DescriptionList>
          </DataListContent>
        </DataListItem>
      </DataList>
      <div className="release-policy-item__description">{releasePackageInfo.description}</div>
    </div>
  );
};

export default ReleasePolicyPackageItem;
