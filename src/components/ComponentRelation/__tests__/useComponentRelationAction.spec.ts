import { renderHook } from '@testing-library/react-hooks';
import { useComponents } from '../../../hooks/useComponents';
import { useAccessReviewForModel } from '../../../utils/rbac';
import { useComponentRelationAction } from '../useComponentRelationAction';

jest.mock('../../../utils/rbac', () => ({ useAccessReviewForModel: jest.fn() }));

jest.mock('../../../hooks/useComponents', () => ({ useComponents: jest.fn() }));

const mockUseComponents = useComponents as jest.Mock;
const mockUseAccessReviewModel = useAccessReviewForModel as jest.Mock;

describe('useComponentRelationAction', () => {
  beforeEach(() => {
    mockUseComponents.mockReturnValue([[{}, {}], true, undefined]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not disable action', () => {
    mockUseAccessReviewModel.mockReturnValue([true]);
    const { result } = renderHook(() => useComponentRelationAction('application'));
    expect(result.current().isDisabled).toEqual(false);
    expect(result.current().disabledTooltip).toEqual(null);
  });

  it('should disble action when access review return false', () => {
    mockUseAccessReviewModel.mockReturnValue([false]);
    const { result } = renderHook(() => useComponentRelationAction('application'));
    expect(result.current().isDisabled).toEqual(true);
    expect(result.current().disabledTooltip).toEqual(
      `You don't have access to define component relationships`,
    );
  });
});
