import { ComponentKind } from '../../types';
import { getURLForComponentPRs, isPACEnabled, PAC_ANNOTATION } from '../component-utils';

describe('component-utils', () => {
  it('should detect pac enabled state', () => {
    const createComponent = (pacValue: string | undefined): ComponentKind => {
      let result: any;
      if (pacValue) {
        result = {
          metadata: {
            annotations: {
              [PAC_ANNOTATION]: pacValue,
            },
          },
        };
      }
      return (result ?? {}) as ComponentKind;
    };
    expect(isPACEnabled(createComponent(undefined))).toBe(false);
    expect(isPACEnabled(createComponent('request'))).toBe(true);
    expect(isPACEnabled(createComponent('request'), true)).toBe(false);
    expect(isPACEnabled(createComponent('done'), false)).toBe(true);
    expect(isPACEnabled(createComponent('done'), true)).toBe(true);
  });

  it('should create github URL for component PRs', () => {
    const createComponent = (url: string, pacEnabled = true): ComponentKind =>
      ({
        metadata: {
          annotations: {
            [PAC_ANNOTATION]: pacEnabled ? 'done' : '',
          },
        },
        spec: {
          source: {
            git: {
              url,
            },
          },
        },
      } as any as ComponentKind);

    expect(getURLForComponentPRs([])).toBe(
      'https://github.com/pulls?q=is:pr+is:open+author:app/appstudio-staging-ci',
    );
    expect(
      getURLForComponentPRs([
        createComponent('test', false),
        createComponent('https://github.com/org/repo', false),
      ]),
    ).toBe('https://github.com/pulls?q=is:pr+is:open+author:app/appstudio-staging-ci');
    expect(
      getURLForComponentPRs([
        createComponent('test', true),
        createComponent('https://github.com/org/repo1', true),
        createComponent('https://github.com/org/repo2', true),
      ]),
    ).toBe(
      'https://github.com/pulls?q=is:pr+is:open+author:app/appstudio-staging-ci+repo:org/repo1+repo:org/repo2',
    );
  });
});
