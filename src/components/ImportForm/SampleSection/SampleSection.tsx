import * as React from 'react';
import { CatalogTile } from '@patternfly/react-catalog-view-extension';
import {
  Badge,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
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
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons';
import { useFormikContext } from 'formik';
import { HelpTooltipIcon } from '../../../shared';
import { getIconProps } from '../../../shared/components/catalog/utils/catalog-utils';
import { skeletonTileSelector } from '../../../shared/components/catalog/utils/skeleton-catalog';
import { CatalogItem } from '../../../shared/components/catalog/utils/types';
import { StatusBox } from '../../../shared/components/status-box/StatusBox';
import { ImportFormValues, ImportStrategy } from '../utils/types';
import { useDevfileSamples } from '../utils/useDevfileSamples';
import SamplesInfoAlert from './SampleInfoAlert';

import './SampleSection.scss';
import '../../../shared/style.scss';

const SamplesEmptyState = ({ onClear }) => (
  <EmptyState variant={EmptyStateVariant.full}>
    <EmptyStateIcon icon={SearchIcon} />
    <Title headingLevel="h2" size="lg">
      No results found
    </Title>
    <EmptyStateBody>
      No results match the filter criteria. Remove filters or clear all filters to show results.
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <Button variant="link" onClick={onClear} data-test="catalog-clear-filters">
        Clear all filters
      </Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
);

const SampleSection = ({ onStrategyChange }) => {
  const { setFieldValue } = useFormikContext<ImportFormValues>();
  const [selected, setSelected] = React.useState<CatalogItem>();

  const [filter, setFilter] = React.useState('');
  const [samples, loaded, loadError] = useDevfileSamples();

  const filteredSamples = React.useMemo(
    () =>
      loaded
        ? samples.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
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
            Just be sure to fork the sample so that you<span>&apos;</span>re free to make changes.
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
                      description={sample.description}
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
                    />
                  </GalleryItem>
                ))}
              </Gallery>
            </div>
          ) : (
            <SamplesEmptyState onClear={() => setFilter('')} />
          )}
        </StatusBox>
      </PageSection>
    </>
  );
};

export default SampleSection;
