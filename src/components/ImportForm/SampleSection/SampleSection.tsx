import * as React from 'react';
import { CatalogTile } from '@patternfly/react-catalog-view-extension';
import {
  Badge,
  Button,
  ButtonVariant,
  FormGroup,
  Gallery,
  GalleryItem,
  PageSection,
} from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { HelpTooltipIcon } from '../../../shared';
import { getIconProps } from '../../../shared/components/catalog/utils/catalog-utils';
import { skeletonTileSelector } from '../../../shared/components/catalog/utils/skeleton-catalog';
import { CatalogItem } from '../../../shared/components/catalog/utils/types';
import { StatusBox } from '../../../shared/components/status-box/StatusBox';
import { getDevfileSamples } from '../../../utils/devfile-utils';
import { useComponentDetection } from '../utils/cdq-utils';
import { transformComponentValues } from '../utils/transform-utils';
import { ImportFormValues, ImportStrategy } from '../utils/types';

import './SampleSection.scss';
import '../../../shared/style.scss';

const SampleSection = ({ onStrategyChange }) => {
  const {
    values: { source, application },
    setFieldValue,
  } = useFormikContext<ImportFormValues>();
  const [selected, setSelected] = React.useState<CatalogItem>();
  const [samples, setSamples] = React.useState<CatalogItem[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [loadError, setLoadError] = React.useState<string>();

  const [detectedComponents, detectedComponentsLoaded, detectedComponentsError] =
    useComponentDetection(source, application);

  const detectingComponents = selected && !detectedComponents && !detectedComponentsLoaded;

  React.useEffect(() => {
    let unmounted = false;
    const fetchDevfileSamples = async () => {
      if (unmounted) return;

      try {
        const devfileSamples = await getDevfileSamples();

        if (devfileSamples) {
          setSamples(devfileSamples);
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
              componentName: `${component.componentStub.componentName}-sample`,
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
  }, [detectedComponents, detectingComponents, setFieldValue]);

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

  return (
    <>
      <PageSection variant="light" isFilled>
        <FormGroup
          fieldId="sample-selector"
          label="Select a sample"
          labelIcon={
            <HelpTooltipIcon content="Get started using applications by choosing a code sample." />
          }
          labelInfo={
            <>
              Could not find what you need?{' '}
              <Button variant={ButtonVariant.link} onClick={handleStrategyChange} isInline>
                Import your code.
              </Button>
            </>
          }
          helperText={
            (detectingComponents && 'Detecting sample component values...') ||
            (detectedComponents && 'Detected component values.')
          }
          helperTextInvalid={detectedComponentsError}
          isHelperTextBeforeField
          isRequired
        />
      </PageSection>
      <PageSection padding={{ default: 'noPadding' }} isFilled>
        <StatusBox
          skeleton={skeletonTileSelector}
          data={samples}
          loaded={loaded}
          loadError={loadError}
          label="Catalog items"
        >
          <Gallery className="hac-catalog" hasGutter>
            {samples.map((sample) => (
              <GalleryItem key={sample.uid}>
                <CatalogTile
                  className="hac-catalog__tile"
                  id={sample.uid}
                  title={sample.name}
                  vendor={`Provided by ${sample.provider}`}
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
                />
              </GalleryItem>
            ))}
          </Gallery>
        </StatusBox>
      </PageSection>
    </>
  );
};

export default SampleSection;
