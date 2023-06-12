import * as React from 'react';
import { act, screen } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import { useComponentDetection } from '../../utils/cdq-utils';
import '@testing-library/jest-dom';
import { useDevfileSamples } from '../../utils/useDevfileSamples';
import { RuntimeSelector } from '../RuntimeSelector';

const setFieldValueMock = jest.fn();

jest.mock('../../utils/cdq-utils', () => ({ useComponentDetection: jest.fn() }));

jest.mock('../../utils/useDevfileSamples', () => ({
  useDevfileSamples: jest.fn(),
}));

jest.mock('formik', () => ({
  ...(jest as any).requireActual('formik'),
  useFormikContext: jest.fn(() => ({
    ...(jest as any).requireActual('formik').useFormikContext(),
    setFieldValue: setFieldValueMock,
  })),
}));

const useComponentDetectionMock = useComponentDetection as jest.Mock;
const useDevfileSamplesMock = useDevfileSamples as jest.Mock;
const detectingRuntime = 'Detecting runtime...';

describe('RuntimeSelector', () => {
  it('should show Detecting runtime in the dropdown during detection phase', () => {
    useDevfileSamplesMock.mockReturnValue([[], false]);
    useComponentDetectionMock.mockReturnValue([[], false]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, { source: { git: {} } });

    expect(screen.getByText(detectingRuntime)).toBeVisible();
  });

  it('should show Select a runtime when the initial detection failed to detect a runtime', async () => {
    useDevfileSamplesMock.mockReturnValue([
      [{ name: 'Basic Nodejs', attributes: { projectType: 'nodejs' }, icon: {} }],
      true,
    ]);
    useComponentDetectionMock.mockReturnValue([[], false]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, {
      isDetected: true,
      initialDetectionLoaded: true,
      detectionFailed: true,
      components: [
        {
          projectType: 'quarkus',
        },
      ],
      source: { git: {} },
    });

    await act(() => expect(screen.getByText('Select a runtime')).toBeVisible());
  });

  it('should show Dockerfile when the detected runtime did not match with samples', async () => {
    useDevfileSamplesMock.mockReturnValue([
      [{ name: 'Basic Nodejs', attributes: { projectType: 'nodejs' }, icon: {} }],
      true,
    ]);
    useComponentDetectionMock.mockReturnValue([[], false]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, {
      isDetected: true,
      initialDetectionLoaded: true,
      detectionFailed: false,
      components: [
        {
          projectType: 'quarkus',
        },
      ],
      source: { git: {} },
    });

    expect(setFieldValueMock).toHaveBeenCalledWith('components[0].selectedRuntime', 'Dockerfile');
    await act(() => expect(screen.getByText('Dockerfile')).toBeVisible());
  });

  it('should show Select a runtime when an error occurs', async () => {
    useDevfileSamplesMock.mockReturnValue([
      [{ name: 'Basic Nodejs', attributes: { projectType: 'nodejs' }, icon: {} }],
      true,
    ]);
    useComponentDetectionMock.mockReturnValue([[], false, 'error']);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, {
      isDetected: true,
      initialDetectionLoaded: true,
      detectionFailed: true,
      components: [
        {
          projectType: 'quarkus',
        },
      ],
      source: { git: {} },
    });

    await act(() => expect(screen.getByText('Select a runtime')).toBeVisible());
  });

  it('should show correct message if runtime is automatically detected', () => {
    useDevfileSamplesMock.mockReturnValue([
      [{ name: 'Basic Nodejs', attributes: { projectType: 'nodejs' }, icon: {} }],
      true,
    ]);
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, {
      isDetected: true,
      initialDetectionLoaded: true,
      detectionFailed: false,
      components: [
        {
          projectType: 'nodejs',
        },
      ],
      source: { git: {} },
    });

    expect(setFieldValueMock).toHaveBeenCalledWith('components[0].selectedRuntime', 'Basic Nodejs');
    expect(screen.getByText('Basic Nodejs')).toBeVisible();
  });

  it('should run cdq & set proper validation state on select', async () => {
    useDevfileSamplesMock.mockReturnValue([
      [
        {
          name: 'Basic Nodejs',
          attributes: {
            projectType: 'nodejs',
            git: { remotes: { origin: 'https://github.com/sclorg/nodejs-ex' } },
          },
          icon: {},
        },
      ],
      true,
    ]);
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, {
      source: { git: {} },
      isDetected: false,
      initialDetectionLoaded: true,
      detectionFailed: false,
      components: [
        {
          projectType: 'nodejs',
        },
      ],
    });

    expect(screen.getByText(detectingRuntime)).toBeVisible();
    await act(async () => screen.getByText(detectingRuntime).click());

    useComponentDetectionMock.mockReturnValue([
      { node: { componentStub: { source: { source: { git: {} } } } } },
      true,
    ]);
    await act(async () => screen.getByText('Basic Nodejs').click());

    expect(screen.getByText('Basic Nodejs')).toBeVisible();
    expect(useComponentDetectionMock).toHaveBeenLastCalledWith(
      'https://github.com/sclorg/nodejs-ex',
      undefined,
      undefined,
      undefined,
    );
    expect(setFieldValueMock).toHaveBeenCalledWith('detectionFailed', false);
    expect(setFieldValueMock).toHaveBeenCalledWith('isDetected', true);
  });

  it('should set the context directory when the provided repo is matching with sample runtime repo', async () => {
    useDevfileSamplesMock.mockReturnValue([
      [
        {
          name: 'Basic Nodejs',
          attributes: {
            projectType: 'nodejs',
            git: { remotes: { origin: 'https://github.com/sclorg/nodejs-ex' } },
          },
          icon: {},
        },
      ],
      true,
    ]);
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, {
      source: { git: { url: 'https://github.com/sclorg/nodejs-ex', context: '/testDirectory' } },
      isDetected: false,
      initialDetectionLoaded: true,
      detectionFailed: false,
      components: [
        {
          projectType: 'nodejs',
        },
      ],
    });

    expect(screen.getByText(detectingRuntime)).toBeVisible();
    await act(async () => screen.getByText(detectingRuntime).click());

    useComponentDetectionMock.mockReturnValue([
      { node: { componentStub: { source: { source: { git: {} } } } } },
      true,
    ]);
    await act(async () => screen.getByText('Basic Nodejs').click());

    expect(screen.getByText('Basic Nodejs')).toBeVisible();
    expect(useComponentDetectionMock).toHaveBeenLastCalledWith(
      'https://github.com/sclorg/nodejs-ex',
      undefined,
      '/testDirectory',
      undefined,
    );
    expect(setFieldValueMock).toHaveBeenCalledWith('detectionFailed', false);
    expect(setFieldValueMock).toHaveBeenCalledWith('isDetected', true);
  });

  it('should not set the context directory when the runtime is changed', async () => {
    useDevfileSamplesMock.mockReturnValue([
      [
        {
          name: 'Basic Quarkus',
          attributes: {
            projectType: 'quarkus',
            git: {
              remotes: {
                origin: 'https://github.com/devfile-samples/devfile-sample-code-with-quarkus',
              },
            },
          },
          icon: {},
        },
      ],
      true,
    ]);
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, {
      source: { git: { url: 'https://github.com/sclorg/nodejs-ex', context: '/testDirectory' } },
      isDetected: false,
      initialDetectionLoaded: true,
      detectionFailed: false,
      components: [
        {
          projectType: 'nodejs',
        },
      ],
    });

    expect(screen.getByText(detectingRuntime)).toBeVisible();
    await act(async () => screen.getByText(detectingRuntime).click());

    useComponentDetectionMock.mockReturnValue([
      { node: { componentStub: { source: { source: { git: {} } } } } },
      true,
    ]);
    await act(async () => screen.getByText('Basic Quarkus').click());

    expect(screen.getByText('Basic Quarkus')).toBeVisible();
    expect(useComponentDetectionMock).toHaveBeenLastCalledWith(
      'https://github.com/devfile-samples/devfile-sample-code-with-quarkus',
      undefined,
      undefined,
      undefined,
    );
    expect(setFieldValueMock).toHaveBeenCalledWith('detectionFailed', false);
    expect(setFieldValueMock).toHaveBeenCalledWith('isDetected', true);
  });
});
