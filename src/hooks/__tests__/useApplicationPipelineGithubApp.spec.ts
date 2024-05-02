import { mockLocation } from '../../utils/test-utils';
import { getGithubAppForInternalInstance } from '../useApplicationPipelineGitHubApp';

describe('getGithubAppForInternalInstance', () => {
  it('should return correct env for internal instance host', () => {
    mockLocation({ hostname: 'konflux.apps.stone-prod-p01.wcfb.p1.openshiftapps.com' });
    expect(getGithubAppForInternalInstance()).toEqual({
      url: 'https://github.com/apps/red-hat-konflux',
      name: 'red-hat-konflux',
    });
    mockLocation({ hostname: 'rhtap.apps.rosa.stone-stage-p01.apys.p3.openshiftapps.com' });
    expect(getGithubAppForInternalInstance()).toEqual({
      url: 'https://github.com/apps/konflux-staging',
      name: 'konflux-staging',
    });
    mockLocation({ hostname: 'abcd.com' });
    expect(getGithubAppForInternalInstance()).toEqual({
      url: 'https://github.com/apps/konflux-staging',
      name: 'konflux-staging',
    });
  });
});
