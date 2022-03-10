import * as React from 'react';
import { FormFooter, Page } from '../../shared';
import CatalogView from '../../shared/components/catalog/catalog-view/CatalogView';
import CatalogTile from '../../shared/components/catalog/CatalogTile';
import { skeletonCatalog } from '../../shared/components/catalog/utils/skeleton-catalog';
import { CatalogItem } from '../../shared/components/catalog/utils/types';
import { StatusBox } from '../../shared/components/status-box/StatusBox';
import { getDevfileSamples } from '../../utils/devfile-utils';
import { useFormValues } from '../form-context';
import { useWizardContext } from '../Wizard/Wizard';

export const ComponentSamplesPage = () => {
  const { handleNext, handleBack, handleReset } = useWizardContext();
  const [formState, setValues] = useFormValues();
  const [selected, setSelected] = React.useState<CatalogItem>();
  const [items, setItems] = React.useState<CatalogItem[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [loadError, setLoadError] = React.useState<string>();

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

  const handleSubmit = React.useCallback(() => {
    setValues((prevValues) => ({ ...prevValues, components: [selected] }));
    handleNext();
  }, [selected, setValues, handleNext]);

  const renderTile = React.useCallback(
    (item: CatalogItem) => (
      <CatalogTile
        item={item}
        featured={item.name === selected?.name}
        onClick={() =>
          setSelected((prevState) =>
            prevState ? (prevState.name !== item.name ? item : undefined) : item,
          )
        }
      />
    ),
    [selected],
  );

  return (
    <Page
      breadcrumbs={[
        { path: '/applications', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      heading="Start with a sample"
      description="Get started using applications by choosing a code sample"
    >
      <StatusBox
        skeleton={skeletonCatalog}
        data={items}
        loaded={loaded}
        loadError={loadError}
        label="Catalog items"
      >
        <CatalogView items={items} renderTile={renderTile} hideSidebar={true} />
      </StatusBox>
      <div className="hacDev-page__section">
        <FormFooter
          submitLabel="Next"
          resetLabel="Back"
          isSubmitting={false}
          disableSubmit={!selected}
          errorMessage={undefined}
          handleSubmit={handleSubmit}
          handleReset={handleBack}
          handleCancel={() => {
            handleReset();
            setValues({});
          }}
          sticky
        />
      </div>
    </Page>
  );
};
