import { PACState } from '../../../../hooks/usePACState';
import { getHelpPopoverText, getBuildTriggerText } from '../tabs/ComponentBuildSettings';

describe('getHelpPopoverText', () => {
  it('renders the correct help popover text for enabled PACState', () => {
    expect(getHelpPopoverText(PACState.ready)).toBe(
      'A new build pipeline run is automatically triggered with every commit to the source code.',
    );
  });

  it('renders the correct help popover text for disabled PACState', () => {
    expect(getHelpPopoverText(PACState.disabled)).toBe(
      'Trigger a new build manually from the component’s action menu. To enable an automatic trigger with every commit, upgrade to the Custom build pipeline plan.',
    );
  });
});

describe('getBuildTriggerText', () => {
  it('renders the correct build trigger text based on PACState value', () => {
    expect(getBuildTriggerText(PACState.disabled)).toBe('Manual');
    expect(getBuildTriggerText(PACState.ready)).toBe('Automatic');
  });
});
