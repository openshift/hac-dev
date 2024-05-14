import * as React from 'react';
import { ExpandableSection, Gallery, GalleryItem } from '@patternfly/react-core';
import { skeletonTileSelector } from '../../../../shared/components/catalog/utils/skeleton-catalog';
import { StatusBox } from '../../../../shared/components/status-box/StatusBox';
import SampleCard from './SampleCard';
import { useDevfileSamples } from './useDevfileSamples';

import './SampleSection.scss';

type SampleSectionProp = {
  onSampleImport?: (url: string, name: string) => void;
};

const SampleSection: React.FunctionComponent<React.PropsWithChildren<SampleSectionProp>> = ({
  onSampleImport,
}) => {
  const [samples, loaded, loadError] = useDevfileSamples();

  const filteredSamples = React.useMemo(
    () => (loaded ? samples.filter((item) => !item.attributes.deprecated) : []),
    [samples, loaded],
  );

  return (
    <ExpandableSection
      toggleTextExpanded="Hide samples"
      toggleTextCollapsed="No code? Start with sample"
    >
      <StatusBox
        skeleton={skeletonTileSelector}
        data={samples}
        loaded={loaded}
        loadError={loadError}
        label="Catalog items"
      >
        {filteredSamples.length > 0 ? (
          <Gallery
            className="hac-catalog"
            hasGutter
            minWidths={{
              default: '260px',
            }}
          >
            {filteredSamples.map((sample) => (
              <GalleryItem key={sample.uid}>
                <SampleCard sample={sample} onSampleImport={onSampleImport} />
              </GalleryItem>
            ))}
          </Gallery>
        ) : null}
      </StatusBox>
    </ExpandableSection>
  );
};

export default SampleSection;
