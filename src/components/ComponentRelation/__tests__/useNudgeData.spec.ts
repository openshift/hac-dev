import { renderHook } from '@testing-library/react';
import { useComponents } from '../../../hooks/useComponents';
import { componentCRMocks } from '../../Components/__data__/mock-data';
import { ComponentRelationNudgeType } from '../type';
import { useNudgeData } from '../useNudgeData';

jest.mock('../../../hooks/useComponents', () => ({
  useComponents: jest.fn(),
}));

jest.mock('../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'ns' })),
}));

const mockUseComponent = useComponents as jest.Mock;

describe('useNudgeData', () => {
  it('should trnasform component data to formk initial values', () => {
    mockUseComponent.mockReturnValue([[componentCRMocks[1]], true, null]);
    const { result } = renderHook(() => useNudgeData('application'));
    expect(result.current[0]).toEqual([
      {
        source: 'nodejs',
        nudgeType: ComponentRelationNudgeType.NUDGES,
        target: ['mock-component'],
      },
    ]);
  });

  it('should trnasform component data for nudges and nudges-by to formk initial values', () => {
    mockUseComponent.mockReturnValue([componentCRMocks, true, null]);
    const { result } = renderHook(() => useNudgeData('application'));
    expect(result.current[0]).toEqual([
      {
        nudgeType: 'nudges-by',
        source: 'basic-node-js',
        target: ['mock-component-2', 'mock-component-3'],
      },
      { nudgeType: 'nudges', source: 'nodejs', target: ['mock-component'] },
    ]);
  });
});
