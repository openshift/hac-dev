import * as React from 'react';
import { Badge, DropdownToggle, Spinner } from '@patternfly/react-core';
import { DockerIcon } from '@patternfly/react-icons/dist/esm/icons/docker-icon';
import { ImageIcon } from '@patternfly/react-icons/dist/esm/icons/image-icon';
import { useFormikContext } from 'formik';
import gitUrlParse from 'git-url-parse';
import { DropdownField } from '../../../shared';
import HelpPopover from '../../HelpPopover';
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
  icon: <DockerIcon width={24} height={24} color="#2496ed" />,
  name: 'Dockerfile',
};

export const RuntimeSelector: React.FC<RuntimeSelectorProps> = ({ detectedComponentIndex }) => {
  const fieldPrefix = `components[${detectedComponentIndex}]`;
  const {
    values: {
      secret,
      source: {
        git: { url: sourceUrl, revision, context },
      },
      isDetected,
      detectionFailed,
      initialDetectionLoaded,
      components,
      resourceLimits: { min: defaultResourceLimits } = {},
    },
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = useFormikContext<ImportFormValues>();
  const [samples, samplesLoaded] = useDevfileSamples();
  const [detecting, setDetecting] = React.useState(false);
  const [runtimeSource, setRuntimeSource] = React.useState('');
  const [selectedRuntime, setSelectedRuntime] = React.useState(null);
  const [recommendedRuntime, setRecommendedRuntime] = React.useState(null);
  const originalComponentRef = React.useRef(components?.[detectedComponentIndex]);
  originalComponentRef.current = components?.[detectedComponentIndex];
  const DetectingRuntime = 'Detecting runtime...';

  const items = React.useMemo(() => {
    return [
      ...(samples || []).map((s) => ({
        key: s.uid,
        value: s.name,
        icon: <img src={s.icon.url} />,
      })),
      dockerFileSample,
    ];
  }, [samples]);

  const onChange = (value: string) => {
    const runtime = samples.find((s) => value.includes(s.name));

    if (
      runtime &&
      (runtime?.attributes?.git as any)?.remotes?.origin ===
        selectedRuntime?.attributes?.git?.remotes?.origin
    ) {
      return;
    }
    const runtimeSourceUrl = value.includes(dockerFileSample.value)
      ? gitUrlParse(sourceUrl).toString()
      : (runtime?.attributes?.git as any)?.remotes?.origin;
    setSelectedRuntime(value === dockerFileSample.value ? dockerFileSample : runtime);
    setFieldValue(`${fieldPrefix}.selectedRuntime`, value);
    setRuntimeSource(runtimeSourceUrl);
    setDetecting(true);
    setFieldValue('isDetected', false);
  };

  const [detectedComponents, detectionLoaded, detectionError] = useComponentDetection(
    runtimeSource,
    secret,
    sourceUrl !== runtimeSource ? undefined : context,
    sourceUrl !== runtimeSource ? undefined : revision,
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
      ) : selectedRuntime?.icon?.url ? (
        <img width="24px" height="24px" src={selectedRuntime?.icon?.url} />
      ) : (
        <ImageIcon />
      );

      return (
        <DropdownToggle
          onToggle={onToggle}
          isDisabled={detecting || !samplesLoaded}
          icon={toggleIcon}
          data-test="dropdown-toggle"
        >
          {isDetectingRuntime ? (
            DetectingRuntime
          ) : selectedRuntime?.name ? (
            <>
              {selectedRuntime?.name}
              {selectedRuntime?.name === recommendedRuntime?.name && (
                <>
                  &nbsp;<Badge isRead>Recommended</Badge>
                </>
              )}
            </>
          ) : (
            'Select a runtime'
          )}
        </DropdownToggle>
      );
    },
    [
      isDetectingRuntime,
      selectedRuntime?.icon,
      selectedRuntime?.name,
      detecting,
      samplesLoaded,
      recommendedRuntime?.name,
    ],
  );

  React.useEffect(() => {
    if (
      isDetected &&
      samplesLoaded &&
      !detectionFailed &&
      (!selectedRuntime || selectedRuntime.name === DetectingRuntime)
    ) {
      const runtime =
        samples?.find(
          (s) => s.attributes.projectType === components[detectedComponentIndex]?.projectType,
        ) || dockerFileSample;
      setSelectedRuntime(runtime);
      setRecommendedRuntime(runtime);
      setFieldValue(`${fieldPrefix}.selectedRuntime`, runtime.name);
    } else if (!selectedRuntime && !detectionFailed) {
      setSelectedRuntime({ name: DetectingRuntime });
      setFieldValue(`${fieldPrefix}.selectedRuntime`, null);
    }
  }, [
    components,
    detectedComponentIndex,
    isDetected,
    samples,
    samplesLoaded,
    selectedRuntime,
    detectionFailed,
    setFieldValue,
    fieldPrefix,
  ]);

  React.useEffect(() => {
    if (detectionError) {
      setDetecting(false);
      setFieldError(`${fieldPrefix}.runtime`, detectionError);
    } else if (detectionLoaded && detectedComponents) {
      setDetecting(false);
      setFieldValue('isDetected', true);
      setFieldValue('detectionFailed', false);
      // To avoid formik validating on old values due to a formik bug - https://github.com/jaredpalmer/formik/issues/2083
      setTimeout(() => setFieldTouched('isDetected', true));
      setTimeout(() => setFieldTouched('detectionFailed', true));
      const componentValues = transformComponentValues(
        detectedComponents,
        originalComponentRef.current,
        defaultResourceLimits,
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
    setFieldTouched,
    setFieldValue,
    sourceUrl,
    defaultResourceLimits,
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
      recommended={recommendedRuntime?.name}
      onChange={onChange}
      dropdownToggle={detectingRuntimeToggle}
      helpText="Use the recommended runtime for optimal build and deployment."
      labelIcon={
        <HelpPopover bodyContent="The recommended runtime controls some of your settings, so changing it to an incompatible runtime might break your build or deployment. The runtime detected is based on an analysis of content in the repository. We use the programming language, devfile, and other files to detect the recommended option." />
      }
    />
  );
};
