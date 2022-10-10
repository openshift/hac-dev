import * as React from 'react';
import { act, screen } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import { useComponentDetection } from '../../utils/cdq-utils';
import '@testing-library/jest-dom';
import { useDevfileSamples } from '../../utils/useDevfileSamples';
import { RuntimeSelector } from '../RuntimeSelector';

jest.mock('../../utils/cdq-utils', () => ({ useComponentDetection: jest.fn() }));

jest.mock('../../utils/useDevfileSamples', () => ({
  useDevfileSamples: jest.fn(),
}));

const useComponentDetectionMock = useComponentDetection as jest.Mock;
const useDevfileSamplesMock = useDevfileSamples as jest.Mock;

describe('RuntimeSelector', () => {
  it('should show loading indicator if runtimes are not fetched', () => {
    useDevfileSamplesMock.mockReturnValue([]);
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, { git: {} });

    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('should show dropdown if runtimes are fetched', () => {
    useDevfileSamplesMock.mockReturnValue([[], true]);
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, { git: {} });

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByText('Select a runtime')).toBeVisible();
  });

  it('should show correct message if runtime is automatically detected', () => {
    useDevfileSamplesMock.mockReturnValue([
      [{ name: 'Basic Nodejs', attributes: { projectType: 'nodejs' }, icon: {} }],
      true,
    ]);
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(<RuntimeSelector detectedComponentIndex={0} />, {
      git: {},
      isDetected: true,
      components: [
        {
          projectType: 'nodejs',
        },
      ],
      source: { git: {} },
    });

    expect(screen.getByText('Basic Nodejs')).toBeVisible();
  });

  it('should fetch cdq on select', async () => {
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
      git: {},
      isDetected: false,
      components: [
        {
          projectType: 'nodejs',
        },
      ],
    });

    expect(screen.getByText('Select a runtime')).toBeVisible();
    await act(async () => screen.getByText('Select a runtime').click());

    useComponentDetectionMock.mockReturnValue([
      { node: { componentStub: { source: { git: {} } } } },
      true,
    ]);
    await act(async () => screen.getByText('Basic Nodejs').click());

    expect(screen.getByText('Basic Nodejs')).toBeVisible();
    expect(useComponentDetectionMock).toHaveBeenLastCalledWith(
      'https://github.com/sclorg/nodejs-ex',
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });
});
