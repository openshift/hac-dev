import * as React from 'react';
import { ExpandableSection, Radio, Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { ComponentKind, NudgeStats } from '../../../types';
import ComponentNudgesSVG, { NudgeRadios } from './ComponentNudges';

import './ComponentNudgesDependencies.scss';

type ComponentBuildSettingsProps = {
  component: ComponentKind;
};

const ComponentBuildSettings: React.FC<React.PropsWithChildren<ComponentBuildSettingsProps>> = ({
  component,
}) => {
  const [radioChecked, setRadioChecked] = React.useState<string>(NudgeRadios.NUDGES);
  const [expanded, setExpanded] = React.useState<boolean>(true);

  if (!component) {
    return null;
  }

  const nudges = component.spec?.[NudgeStats.NUDGES];
  const nudgedBy = component.status?.[NudgeStats.NUDGED_BY];

  const setNudgeRadio = (radio: NudgeRadios) => {
    radioChecked !== radio && setRadioChecked(radio);
  };

  return (
    <div className="component-nudges" data-test="component-nudges-dependencies">
      <ExpandableSection
        isExpanded={expanded}
        toggleContent="Show related components"
        className="component-nudges__exandablesection pf-v5-u-mt-md"
        data-test="component-nudges-toggle"
        onToggle={() => setExpanded((x) => !x)}
      >
        <div className="pf-v5-u-pl-md pf-v5-u-mt-md">
          <Radio
            isChecked={radioChecked === NudgeRadios.NUDGES}
            name="radio-nudges"
            data-test="nudges-radio"
            onChange={() => setNudgeRadio(NudgeRadios.NUDGES)}
            label={
              <span className="component-nudges__radio">
                Nudges{' '}
                <Tooltip content="The component's builds propagate changes to the nudged components.">
                  <OutlinedQuestionCircleIcon />
                </Tooltip>
              </span>
            }
            id="radio-nudges"
          />
          <Radio
            isChecked={radioChecked === NudgeRadios.NUDGED_BY}
            name="radio-nudged-by"
            data-test="nudged-by-radio"
            onChange={() => setNudgeRadio(NudgeRadios.NUDGED_BY)}
            label={
              <span className="component-nudges__radio">
                Is nudged by{' '}
                <Tooltip content="The component will be changed by the nudging component's builds.">
                  <OutlinedQuestionCircleIcon />
                </Tooltip>
              </span>
            }
            id="radio-nudge"
          />
          <ComponentNudgesSVG
            radioChecked={radioChecked}
            nudgeComponents={radioChecked === NudgeRadios.NUDGES ? nudges : nudgedBy}
            component={component}
          />
        </div>
      </ExpandableSection>
    </div>
  );
};

export default React.memo(ComponentBuildSettings);
