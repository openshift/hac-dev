import * as React from 'react';
import { CatalogTile } from '@patternfly/react-catalog-view-extension';
import {
  Badge,
  Button,
  ButtonVariant,
  Gallery,
  GalleryItem,
  HelperText,
  HelperTextItem,
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
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { useFormikContext } from 'formik';
import { HelpTooltipIcon } from '../../../shared';
import { getIconProps } from '../../../shared/components/catalog/utils/catalog-utils';
import { skeletonTileSelector } from '../../../shared/components/catalog/utils/skeleton-catalog';
import { CatalogItem } from '../../../shared/components/catalog/utils/types';
import { StatusBox } from '../../../shared/components/status-box/StatusBox';
import FilteredEmptyState from '../../EmptyState/FilteredEmptyState';
import { HeadTitle } from '../../HeadTitle';
import { ImportFormValues, ImportStrategy } from '../utils/types';
import { useDevfileSamples } from '../utils/useDevfileSamples';
import SamplesInfoAlert from './SampleInfoAlert';

import './SampleSection.scss';
import '../../../shared/style.scss';

const SampleSection = ({ onStrategyChange }) => {
  const { setFieldValue } = useFormikContext<ImportFormValues>();
  const [selected, setSelected] = React.useState<CatalogItem>();

  const [filter, setFilter] = React.useState('');
  const [samples, loaded, loadError] = useDevfileSamples();

  const filteredSamples = React.useMemo(
    () =>
      loaded
        ? samples.filter(
            (item) =>
              item.name.toLowerCase().includes(filter.toLowerCase()) ||
              item.tags.some((c) => c.toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1),
          )
        : [],
    [filter, samples, loaded],
  );

  const handleSelect = React.useCallback(
    (item) => {
      setSelected((prevState) => {
        if (prevState?.name === item.name) {
          setFieldValue('source.git.url', undefined);
          return undefined;
        }
        const newSourceUrl = item?.attributes?.git?.remotes?.origin;

        setFieldValue('source.git.url', newSourceUrl);
        return item;
      });
    },
    [setFieldValue],
  );

  const handleStrategyChange = React.useCallback(() => {
    setFieldValue('source.git.url', '');
    onStrategyChange(ImportStrategy.GIT);
  }, [onStrategyChange, setFieldValue]);

  return (
    <>
      <HeadTitle>Import - Select sample | CI/CD</HeadTitle>
      <PageSection variant="light" isFilled>
        <TextContent>
          <Text component={TextVariants.h2}>
            Select a sample{' '}
            <HelpTooltipIcon content="Get started using applications by choosing a code sample." />
          </Text>
          <HelperText>
            <HelperTextItem>
              <>
                Could not find what you need?{' '}
                <Button variant={ButtonVariant.link} onClick={handleStrategyChange} isInline>
                  Import your code.
                </Button>
              </>
            </HelperTextItem>
          </HelperText>
        </TextContent>
        <SamplesInfoAlert>
          <p>
            If you select a sample, be sure to fork it to your own repository. That way, you can
            edit the sample and choose to customize your pipeline and rebuilds whenever changes are
            made.
          </p>
        </SamplesInfoAlert>
      </PageSection>
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
                  onChange={setFilter}
                  placeholder="Filter by keyword..."
                />
              </ToolbarItem>
              <ToolbarItem alignment={{ default: 'alignRight' }}>
                <TextContent>
                  <Text component={TextVariants.h5}>
                    {pluralize(filteredSamples.length, 'item', 'items')}
                  </Text>
                </TextContent>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          {filteredSamples.length > 0 ? (
            <div>
              <Gallery className="hac-catalog" hasGutter>
                {filteredSamples.map((sample) => (
                  <GalleryItem key={sample.uid}>
                    <CatalogTile
                      className="hac-catalog__tile"
                      id={sample.uid}
                      title={sample.name}
                      featured={sample.name === selected?.name}
                      data-test={`${sample.type}-${sample.name}`}
                      badges={sample.tags?.map((tag) => (
                        <Badge key={tag} isRead>
                          {tag}
                        </Badge>
                      ))}
                      {...getIconProps(sample)}
                      onClick={() => handleSelect(sample)}
                      footer={
                        <Button
                          variant="link"
                          isInline
                          iconPosition="right"
                          icon={
                            <ExternalLinkAltIcon
                              style={{ marginLeft: 'var(--pf-global--spacer--xs)' }}
                            />
                          }
                          onClick={(e) => e.stopPropagation()}
                          component={(props) => (
                            <a
                              {...props}
                              href={
                                (sample.attributes.git as { remotes: { [key: string]: string } })
                                  .remotes.origin
                              }
                              target={'_blank'}
                              rel="noreferrer"
                            />
                          )}
                        >
                          Git repository
                        </Button>
                      }
                    >
                      {sample.description}
                    </CatalogTile>
                  </GalleryItem>
                ))}
              </Gallery>
            </div>
          ) : (
            <FilteredEmptyState onClearFilters={() => setFilter('')} />
          )}
        </StatusBox>
      </PageSection>
    </>
  );
};

export default SampleSection;
