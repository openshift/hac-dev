import * as React from 'react';
import { CatalogTile } from '@patternfly/react-catalog-view-extension';
import {
  Alert,
  Backdrop,
  Badge,
  Bullseye,
  Button,
  ButtonVariant,
  Card,
  CardBody,
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
  Spinner,
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
import { HelpTooltipIcon, useResizeObserver } from '../../../shared';
import { getIconProps } from '../../../shared/components/catalog/utils/catalog-utils';
import { skeletonTileSelector } from '../../../shared/components/catalog/utils/skeleton-catalog';
import { CatalogItem } from '../../../shared/components/catalog/utils/types';
import { StatusBox } from '../../../shared/components/status-box/StatusBox';
import { sanitizeName } from '../../../utils/create-utils';
import { useComponentDetection } from '../utils/cdq-utils';
import { transformComponentValues } from '../utils/transform-utils';
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
  const {
    values: { source, application },
    setFieldValue,
  } = useFormikContext<ImportFormValues>();
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

  const [detectedComponents, detectedComponentsLoaded, detectedComponentsError] =
    useComponentDetection(source, application);

  const detectingComponents = selected && !detectedComponents && !detectedComponentsLoaded;

  React.useEffect(() => {
    let unmounted = false;
    if (unmounted) return;

    if (detectingComponents) {
      setFieldValue('isValidated', false);
    }

    if (!detectingComponents) {
      if (detectedComponents) {
        const transformedComponents = transformComponentValues(detectedComponents).map(
          (component) => ({
            ...component,
            componentStub: {
              ...component.componentStub,
              componentName: `${sanitizeName(application)}-${
                component.componentStub.componentName
              }-sample`,
            },
          }),
        );
        setFieldValue('components', transformedComponents);
        setFieldValue('isValidated', true);
      } else {
        setFieldValue('components', null);
        setFieldValue('isValidated', false);
      }
    }

    return () => {
      unmounted = true;
    };
  }, [application, detectedComponents, detectingComponents, setFieldValue]);

  const handleSelect = React.useCallback(
    (item) => {
      setSelected((prevState) => {
        if (prevState?.name === item.name) {
          setFieldValue('source', undefined);
          return undefined;
        }
        const sourceUrl = item?.attributes?.git?.remotes?.origin;

        setFieldValue('source', sourceUrl);
        return item;
      });
    },
    [setFieldValue],
  );

  const handleStrategyChange = React.useCallback(() => {
    setFieldValue('source', '');
    onStrategyChange(ImportStrategy.GIT);
  }, [onStrategyChange, setFieldValue]);

  const [dimensions, setDimensions] = React.useState({});

  const elementRef = React.useRef<HTMLDivElement>();
  useResizeObserver(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useCallback(() => {
      if (elementRef.current) {
        const { height, width } = elementRef.current.getBoundingClientRect();
        setDimensions({
          position: 'absolute',
          height,
          width,
          top: elementRef.current.offsetTop,
          left: elementRef.current.offsetLeft,
        });
      }
    }, []),
    elementRef.current,
  );

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
        {selected && detectedComponentsError ? (
          <Alert variant="danger" isInline title={`Unable to load ${selected.name}`}>
            {detectedComponentsError?.message || detectedComponentsError}
          </Alert>
        ) : null}
        {detectingComponents && (
          <Backdrop style={dimensions}>
            <Bullseye>
              <Card isRounded isCompact>
                <CardBody>
                  <Bullseye style={{ marginBottom: 'var(--pf-global--spacer--md)' }}>
                    <Spinner size="lg" />
                  </Bullseye>
                  <HelperText>
                    <HelperTextItem variant="indeterminate">Detecting values...</HelperTextItem>
                  </HelperText>
                </CardBody>
              </Card>
            </Bullseye>
          </Backdrop>
        )}
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
            <div ref={elementRef}>
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
