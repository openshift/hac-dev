import { renderHook } from '@testing-library/react-hooks';
import { useAccessReviewForModel } from '../../../../utils/rbac';
import { useModalLauncher } from '../../../modal/ModalProvider';
import { useWhatsNextItems } from '../useWhatsNextItems';

jest.mock('../../../../utils/workspace-context-utils', () => ({
  useWorkspaceInfo: jest.fn(() => ({ namespace: 'test-ns' })),
}));

jest.mock('../../../../hooks/useApplicationPipelineGitHubApp', () => ({
  useApplicationPipelineGitHubApp: jest.fn(() => ({
    name: 'test-app',
    url: 'https://github.com/test-app',
  })),
}));

jest.mock('../../../../utils/rbac', () => ({
  useAccessReviewForModel: jest.fn(() => [true, true]),
}));

jest.mock('../../../modal/ModalProvider', () => ({
  useModalLauncher: jest.fn(() => () => {}),
}));

describe('useWhatsNextItems', () => {
  it('should return a list of whats next items', () => {
    const applicationName = 'test-application';
    const { result } = renderHook(() => useWhatsNextItems(applicationName));
    expect(result.current).toHaveLength(6);
    expect(result.current).toMatchSnapshot();
  });

  it('should return a list of whats next items with disabled add component button', () => {
    const applicationName = 'test-application';
    (useAccessReviewForModel as jest.Mock).mockReturnValueOnce([false, true]);
    const { result } = renderHook(() => useWhatsNextItems(applicationName));
    expect(result.current[0].cta.disabled).toBe(true);
  });

  it('should launch modal for manage build pipelines', () => {
    const applicationName = 'test-application';
    const showModal = jest.fn();
    (useModalLauncher as jest.Mock).mockReturnValueOnce(showModal);
    const { result } = renderHook(() => useWhatsNextItems(applicationName));
    result.current[5].cta.onClick();
    expect(showModal).toHaveBeenCalled();
  });
});
