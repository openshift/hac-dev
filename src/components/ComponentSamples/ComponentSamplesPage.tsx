import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { CatalogTile } from '@patternfly/react-catalog-view-extension';
import {
  Badge,
  Gallery,
  GalleryItem,
  PageSection,
  SearchInput,
  Text,
  TextContent,
  TextVariants,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
  pluralize,
} from '@patternfly/react-core';
import { FormFooter } from '../../shared';
import { getIconProps } from '../../shared/components/catalog/utils/catalog-utils';
import { skeletonCatalog } from '../../shared/components/catalog/utils/skeleton-catalog';
import { CatalogItem } from '../../shared/components/catalog/utils/types';
import { StatusBox } from '../../shared/components/status-box/StatusBox';
import { getDevfileSamples } from '../../utils/devfile-utils';
import { mapDetectedComponents, useComponentDetection } from '../AddComponent/utils';
import { useFormValues } from '../form-context';
import PageLayout from '../PageLayout/PageLayout';
import { createResources } from '../ReviewComponents/submit-utils';
import { ReviewComponentsFormValues } from '../ReviewComponents/types';
import { transformComponentValues } from '../ReviewComponents/utils';
import { useWizardContext } from '../Wizard/Wizard';
import SamplesEmptyState from './SamplesEmptyState';

import '../../shared/style.scss';
import './ComponentSamplesPage.scss';

export const ComponentSamplesPage = () => {
  const history = useHistory();
  const { handleBack, handleReset } = useWizardContext();
  const [formState, setValues] = useFormValues();
  const [selected, setSelected] = React.useState<CatalogItem>();
  const [items, setItems] = React.useState<CatalogItem[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [loadError, setLoadError] = React.useState<string>();
  const [filter, setFilter] = React.useState('');
  const [componentData, setComponentData] =
    React.useState<ReviewComponentsFormValues['components']>();
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string>();

  const filteredItems = React.useMemo(
    () =>
      loaded ? items.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase())) : [],
    [filter, items, loaded],
  );

  React.useEffect(() => {
    let unmounted = false;
    if (formState.components?.[0]?.type === 'sample') {
      !unmounted && setSelected(formState.components[0]);
    }
    return () => {
      unmounted = true;
    };
    // We just need setSelected called once when the component is mounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let unmounted = false;
    const fetchDevfileSamples = async () => {
      if (unmounted) return;

      try {
        const devfileSamples = await getDevfileSamples();

        if (devfileSamples) {
          setItems(devfileSamples);
          setLoaded(true);
        }
      } catch (e) {
        setLoadError(`Failed to load devfile samples: ${e.message}`);
      }
    };

    fetchDevfileSamples();
    return () => {
      unmounted = true;
    };
  }, []);

  const sourceUrl = selected?.attributes?.git?.remotes?.origin;

  const [detectedComponents] = useComponentDetection(sourceUrl, formState.application);

  React.useEffect(() => {
    if (detectedComponents) {
      const mappedComponents = mapDetectedComponents(detectedComponents);
      const transformedComponents = transformComponentValues(mappedComponents);
      setComponentData(transformedComponents);
    }
  }, [detectedComponents]);

  const handleSubmit = React.useCallback(() => {
    setSubmitting(true);
    createResources(formState, componentData)
      .then((appName) => {
        history.push(`/app-studio/applications?name=${appName}`);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('Error while submitting import form:', error);
        setSubmitting(false);
        setSubmitError(error.message);
      });
  }, [formState, componentData, history]);

  const footer = (
    <FormFooter
      submitLabel="Create"
      resetLabel="Back"
      isSubmitting={submitting || (selected && !componentData)}
      disableSubmit={!selected || !componentData || submitting}
      errorMessage={submitError}
      handleSubmit={handleSubmit}
      handleReset={handleBack}
      handleCancel={() => {
        handleReset();
        setValues({});
      }}
    />
  );

  return (
    <PageLayout
      breadcrumbs={[
        { path: '/app-studio/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      title="Start with a sample"
      description="Get started using applications by choosing a code sample."
      footer={footer}
    >
      <PageSection padding={{ default: 'noPadding' }} isFilled>
        <StatusBox
          skeleton={skeletonCatalog}
          data={items}
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
                    {pluralize(filteredItems.length, 'item', 'items')}
                  </Text>
                </TextContent>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          {filteredItems.length > 0 ? (
            <Gallery className="hac-catalog" hasGutter>
              {filteredItems.map((item) => (
                <GalleryItem key={item.uid}>
                  <CatalogTile
                    className="hac-catalog__tile"
                    id={item.uid}
                    title={item.name}
                    vendor={`Provided by ${item.provider}`}
                    description={item.description}
                    featured={item.name === selected?.name}
                    data-test={`${item.type}-${item.name}`}
                    badges={item.tags?.map((tag) => (
                      <Badge key={tag} isRead>
                        {tag}
                      </Badge>
                    ))}
                    {...getIconProps(item)}
                    onClick={() =>
                      setSelected((prevState) =>
                        prevState ? (prevState.name !== item.name ? item : undefined) : item,
                      )
                    }
                  />
                </GalleryItem>
              ))}
            </Gallery>
          ) : (
            <SamplesEmptyState onClear={() => setFilter('')} />
          )}
        </StatusBox>
      </PageSection>
    </PageLayout>
  );
};
