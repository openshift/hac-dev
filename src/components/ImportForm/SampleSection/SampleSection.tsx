import * as React from 'react';
import { CatalogTile } from '@patternfly/react-catalog-view-extension';
import {
  Backdrop,
  Badge,
  Bullseye,
  Button,
  ButtonVariant,
  FormGroup,
  Gallery,
  GalleryItem,
  PageSection,
  Spinner,
} from '@patternfly/react-core';
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

import './SampleSection.scss';
import '../../../shared/style.scss';

const SampleSection = ({ onStrategyChange }) => {
  const {
    values: { source, application },
    setFieldValue,
  } = useFormikContext<ImportFormValues>();
  const [selected, setSelected] = React.useState<CatalogItem>();

  const [samples, loaded, loadError] = useDevfileSamples();

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
          helperTextInvalid={detectedComponentsError}
          isHelperTextBeforeField
          isRequired
        />
      </PageSection>
      <PageSection padding={{ default: 'noPadding' }} isFilled>
        {detectingComponents && (
          <Backdrop style={dimensions}>
            <Bullseye>
              <Spinner size="xl" />
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
          <div ref={elementRef}>
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
          </div>
        </StatusBox>
      </PageSection>
    </>
  );
};

export default SampleSection;
