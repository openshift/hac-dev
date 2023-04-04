import * as React from 'react';
import { DropdownToggle, Spinner } from '@patternfly/react-core';
import { DockerIcon } from '@patternfly/react-icons/dist/esm/icons/docker-icon';
import { useFormikContext } from 'formik';
import { DropdownField } from '../../../shared';
import { useComponentDetection } from '../utils/cdq-utils';
import { transformComponentValues } from '../utils/transform-utils';
import { ImportFormValues } from '../utils/types';
import { useDevfileSamples } from '../utils/useDevfileSamples';

type RuntimeSelectorProps = {
  detectedComponentIndex: number;
};

const patchSourceUrl = (stub: any, url: string) => {
  return {
    ...stub,
    source: {
      git: {
        ...stub.source.git,
        url,
      },
    },
  };
};

const dockerFileSample = {
  key: 'docker-build',
  value: 'Dockerfile',
  icon: <DockerIcon color="#2496ed" />,
  name: 'Dockerfile',
};

export const RuntimeSelector: React.FC<RuntimeSelectorProps> = ({ detectedComponentIndex }) => {
  const fieldPrefix = `components[${detectedComponentIndex}]`;
  const {
    values: {
      secret,
      application,
      source: {
        git: { url: sourceUrl, revision, context },
      },
      isDetected,
      detectionFailed,
      initialDetectionLoaded,
      components,
    },
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = useFormikContext<ImportFormValues>();
  const [samples, samplesLoaded] = useDevfileSamples();
  const [detecting, setDetecting] = React.useState(false);
  const [runtimeSource, setRuntimeSource] = React.useState('');
  const [selectedRuntime, setSelectedRuntime] = React.useState(null);
  const originalComponentRef = React.useRef(components?.[detectedComponentIndex]);
  originalComponentRef.current = components?.[detectedComponentIndex];
  const DetectingRuntime = 'Detecting runtime...';

  const items = React.useMemo(() => {
    return (
      [
        ...(samples || []).map((s) => ({
          key: s.uid,
          value: s.name,
          icon: <img src={s.icon.url} />,
        })),
        ...(!detectionFailed ? [dockerFileSample] : []),
      ] || []
    );
  }, [samples, detectionFailed]);

  const onChange = (value: string) => {
    const runtime = samples.find((s) => s.name === value);
    if (
      (runtime?.attributes?.git as any)?.remotes?.origin ===
      selectedRuntime?.attributes?.git?.remotes?.origin
    ) {
      return;
    }
    const runtimeSourceUrl =
      value === dockerFileSample.value
        ? sourceUrl
        : (runtime?.attributes?.git as any)?.remotes?.origin;
    setSelectedRuntime(value === dockerFileSample.value ? dockerFileSample : runtime);
    setRuntimeSource(runtimeSourceUrl);
    setDetecting(true);
    setFieldValue('isDetected', false);
  };

  const [detectedComponents, detectionLoaded, detectionError] = useComponentDetection(
    runtimeSource,
    application,
    secret,
    sourceUrl !== runtimeSource ? undefined : context,
    revision,
  );

  const isDetectingRuntime =
    !initialDetectionLoaded ||
    (runtimeSource && !detectionLoaded && !detectionError) ||
    selectedRuntime?.name === DetectingRuntime;

  const detectingRuntimeToggle = React.useCallback(
    (onToggle) => {
      const toggleIcon = isDetectingRuntime ? (
        <Spinner
          size="md"
          isSVG
          aria-label="detecting runtime"
          style={{ marginRight: 'var(--pf-global--spacer--xs)' }}
        />
      ) : React.isValidElement(selectedRuntime?.icon) ? (
        selectedRuntime?.icon
      ) : (
        <img width="24px" height="24px" src={selectedRuntime?.icon?.url} />
      );

      return (
        <DropdownToggle
          onToggle={onToggle}
          isDisabled={detecting || !samplesLoaded}
          icon={toggleIcon}
          data-test="dropdown-toggle"
        >
          {isDetectingRuntime ? DetectingRuntime : selectedRuntime?.name || 'Select a runtime'}
        </DropdownToggle>
      );
    },
    [detecting, samplesLoaded, selectedRuntime, isDetectingRuntime],
  );

  React.useEffect(() => {
    if (
      isDetected &&
      samplesLoaded &&
      !detectionFailed &&
      (!selectedRuntime || selectedRuntime.name === DetectingRuntime)
    ) {
      setSelectedRuntime(
        samples?.find(
          (s) => s.attributes.projectType === components[detectedComponentIndex]?.projectType,
        ) || dockerFileSample,
      );
    } else if (!selectedRuntime && !detectionFailed) {
      setSelectedRuntime({ name: DetectingRuntime });
    }
  }, [
    components,
    detectedComponentIndex,
    isDetected,
    samples,
    samplesLoaded,
    selectedRuntime,
    detectionFailed,
  ]);

  React.useEffect(() => {
    if (detectionError) {
      setDetecting(false);
      setFieldError(`${fieldPrefix}.runtime`, detectionError);
    } else if (detectionLoaded && detectedComponents) {
      setDetecting(false);
      // To avoid formik validating on old values due to a formik bug - https://github.com/jaredpalmer/formik/issues/2083
      setTimeout(() => setFieldValue('isDetected', true));
      setTimeout(() => setFieldValue('detectionFailed', false));
      const componentValues = transformComponentValues(
        detectedComponents,
        originalComponentRef.current,
      )[0];
      const component = patchSourceUrl(componentValues.componentStub, sourceUrl);
      setFieldValue(`${fieldPrefix}.componentStub`, component);
      setFieldValue(`${fieldPrefix}.language`, componentValues.language);
    }
  }, [
    detectedComponentIndex,
    detectedComponents,
    detectionError,
    detectionLoaded,
    fieldPrefix,
    setFieldError,
    setFieldValue,
    sourceUrl,
  ]);

  // touch the dropdown field on load so validation error message can be shown
  React.useEffect(() => {
    setFieldTouched('runtime');
  }, [setFieldTouched]);

  return (
    <DropdownField
      name="runtime"
      label="Runtime"
      items={items}
      isDisabled={detecting || !samplesLoaded}
      placeholder="Select a runtime"
      value={selectedRuntime?.name}
      onChange={onChange}
      dropdownToggle={detectingRuntimeToggle}
    />
  );
};
