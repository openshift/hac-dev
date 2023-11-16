import * as React from 'react';
import { Link } from 'react-router-dom';
import { ExpandableSection, Radio, Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { ComponentKind } from '../../../../types';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';

import './ComponentNudgesDependencies.scss';

type ComponentBuildSettingsProps = {
  component: ComponentKind;
};

const MOCK_NUDGES = ['comp-in1', 'comp-in2', 'comp-in3'];
const MOCK_NUDGED_BY = ['out-comp-1', 'out-comp-2', 'out-comp-3', 'out-comp-4'];

enum NudgeRadios {
  NUDGES = 'nudges',
  NUDGED_BY = 'isNudgedBy',
}

const ComponentBuildSettings: React.FC<React.PropsWithChildren<ComponentBuildSettingsProps>> = ({
  component,
}) => {
  const [radioChecked, setRadioChecked] = React.useState<string>(NudgeRadios.NUDGES);
  const { workspace } = useWorkspaceInfo();
  const nudges = MOCK_NUDGES;
  const nudgedBy = MOCK_NUDGED_BY;

  const setNudgeRadio = (radio: NudgeRadios) => {
    radioChecked !== radio && setRadioChecked(radio);
  };

  const emptyState = <>No dependencies found</>;

  return (
    <div className="component-nudges">
      <ExpandableSection
        toggleContent="Show related components"
        className="component-nudges__exandablesection pf-v5-u-mt-md"
      >
        <div className="pf-v5-u-pl-md pf-v5-u-mt-md">
          <Radio
            isChecked={radioChecked === NudgeRadios.NUDGES}
            name="radio-1"
            onChange={() => setNudgeRadio(NudgeRadios.NUDGES)}
            label={
              <span className="component-nudges__radio">
                Nudges{' '}
                <Tooltip content="The component's builds propagate changes to the nudged components.">
                  <OutlinedQuestionCircleIcon />
                </Tooltip>
              </span>
            }
            id="radio-controlled"
          />
          <Radio
            isChecked={radioChecked === NudgeRadios.NUDGED_BY}
            name="radio-1"
            onChange={() => setNudgeRadio(NudgeRadios.NUDGED_BY)}
            label={
              <span className="component-nudges__radio">
                Is nudged by{' '}
                <Tooltip content="The component will be changed by the nudging component's builds.">
                  <OutlinedQuestionCircleIcon />
                </Tooltip>
              </span>
            }
            id="radio-controlled"
          />
          <div className="component-nudges__svgbox pf-v5-u-mt-md">
            <svg viewBox={`0 0 200 ${MOCK_NUDGES.length * 30}`} xmlns="http://www.w3.org/2000/svg">
              <link rel="stylesheet" href="style8.css" type="text/css" />
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 12 12"
                  refX="6"
                  refY="6"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                  className="component-nudges__arrow"
                >
                  <path d="M 0 0 L 12 6 L 0 12 z" />
                </marker>
              </defs>

              <text x="10" fontSize="10px" y="10" className="component-nudges__main-component">
                {component.metadata?.name}
              </text>

              {radioChecked === NudgeRadios.NUDGES && Array.isArray(nudgedBy) && nudgedBy.length > 0
                ? nudges.map((n, i) => {
                    return (
                      <>
                        <polyline
                          key={n}
                          className="component-nudges__connector"
                          points={`20,20 20,${20 * i + 40} 38,${20 * i + 40}`}
                          fill="none"
                          stroke="black"
                          markerEnd="url(#arrow)"
                        />
                        <Link
                          to={`/application-pipeline/workspaces/${workspace}/import?application=${component?.spec?.application}`}
                        >
                          <text
                            x="44"
                            fontSize="9px"
                            y={`${20 * i + 42}`}
                            className="component-nudges__link"
                          >
                            {n}
                          </text>
                        </Link>
                      </>
                    );
                  })
                : emptyState}
              {radioChecked === NudgeRadios.NUDGED_BY &&
              Array.isArray(nudgedBy) &&
              nudgedBy.length > 0
                ? nudgedBy.map((n, i) => {
                    return (
                      <>
                        <polyline
                          className="component-nudges__connector"
                          key={n}
                          fill="none"
                          points={`20,24 20,${20 * i + 40} 42,${20 * i + 40}`}
                          stroke="black"
                          markerStart="url(#arrow)"
                        />
                        <Link
                          to={`/application-pipeline/workspaces/${workspace}/application/${component?.spec?.application}//components/${component?.metadata?.name}`}
                        >
                          <text
                            x="44"
                            fontSize="9px"
                            y={`${20 * i + 42}`}
                            className="component-nudges__link"
                          >
                            {n}
                          </text>
                        </Link>
                      </>
                    );
                  })
                : emptyState}
            </svg>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
};

export default React.memo(ComponentBuildSettings);
