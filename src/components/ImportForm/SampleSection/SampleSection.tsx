import * as React from 'react';
import {
  Gallery,
  GalleryItem,
  PageSection,
  pluralize,
  SearchInput,
  Text,
  TextContent,
  TextVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from '@patternfly/react-core';
import { skeletonTileSelector } from '../../../shared/components/catalog/utils/skeleton-catalog';
import { StatusBox } from '../../../shared/components/status-box/StatusBox';
import FilteredEmptyState from '../../EmptyState/FilteredEmptyState';
import { useDevfileSamples } from '../utils/useDevfileSamples';
import SampleCard from './SampleCard';

import './SampleSection.scss';

type SampleSectionProp = {
  onSampleImport: (url: string, name: string) => void;
};

const SampleSection: React.FunctionComponent<SampleSectionProp> = ({ onSampleImport }) => {
  const [filter, setFilter] = React.useState('');
  const [samples, loaded, loadError] = useDevfileSamples();

  const filteredSamples = React.useMemo(
    () =>
      loaded
        ? samples.filter(
            (item) =>
              !item.attributes.deprecated &&
              (item.name.toLowerCase().includes(filter.toLowerCase()) ||
                item.tags.some((c) => c.toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1)),
          )
        : [],
    [filter, samples, loaded],
  );

  return (
    <PageSection padding={{ default: 'noPadding' }} isFilled>
      <StatusBox
        skeleton={skeletonTileSelector}
        data={samples}
        loaded={loaded}
        loadError={loadError}
        label="Catalog items"
      >
        <Toolbar usePageInsets>
          <ToolbarContent>
            <ToolbarItem variant={ToolbarItemVariant['search-filter']}>
              <SearchInput
                data-test="search-catalog"
                value={filter}
                onChange={(e, name) => setFilter(name)}
                placeholder="Filter by keyword..."
              />
            </ToolbarItem>
            <ToolbarItem align={{ default: 'alignRight' }}>
              <TextContent>
                <Text component={TextVariants.h5}>
                  {`${filteredSamples.length} of ${pluralize(samples.length, 'item', 'items')}`}
                </Text>
              </TextContent>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
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
        ) : (
          <FilteredEmptyState onClearFilters={() => setFilter('')} />
        )}
      </StatusBox>
    </PageSection>
  );
};

export default SampleSection;
