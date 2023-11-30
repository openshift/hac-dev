import * as React from 'react';
import { Link } from 'react-router-dom';
import { ComponentKind } from '../../../../types';
import { useWorkspaceInfo } from '../../../../utils/workspace-context-utils';

export const enum NudgeRadios {
  NUDGES = 'nudges',
  NUDGED_BY = 'isNudgedBy',
}

interface ComponentNudgesSVGprops {
  nudgeComponents: string[];
  radioChecked: string;
  component: ComponentKind;
}

const ComponentNudgesSVG: React.FC<ComponentNudgesSVGprops> = ({
  nudgeComponents,
  radioChecked,
  component,
}) => {
  const { workspace } = useWorkspaceInfo();

  const emptyState = (
    <div data-test="nudges-empty-state" className="component-nudges__empty-state">
      No dependencies found
    </div>
  );

  const isNudges = React.useMemo(() => radioChecked === NudgeRadios.NUDGES, [radioChecked]);

  if (!nudgeComponents || nudgeComponents.length === 0) {
    return emptyState;
  }

  return Array.isArray(nudgeComponents) && nudgeComponents.length > 0 ? (
    <div className="component-nudges__svgbox pf-v5-u-mt-md" key="nudges-list">
      <svg
        viewBox={`0 0 200 ${nudgeComponents.length * 28}`}
        xmlns="http://www.w3.org/2000/svg"
        data-test="nudges-svg"
      >
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
        {nudgeComponents.map((n, i) => {
          return (
            <>
              {isNudges ? (
                <polyline
                  key={n}
                  data-test="nudges-connector"
                  className="component-nudges__connector"
                  points={`20,20 20,${20 * i + 40} 38,${20 * i + 40}`}
                  fill="none"
                  stroke="black"
                  markerEnd="url(#arrow)"
                />
              ) : (
                <polyline
                  key={n}
                  data-test="nudged-by-connector"
                  className="component-nudges__connector"
                  points={`20,20 20,${20 * i + 40} 38,${20 * i + 40}`}
                  fill="none"
                  stroke="black"
                  markerStart="url(#arrow)"
                />
              )}
              <Link
                to={`/application-pipeline/workspaces/${workspace}/application/${component?.spec?.application}/components/${n}`}
                data-test={isNudges ? 'nudges-cmp-link' : 'nudged-by-cmp-link'}
              >
                <text x="44" fontSize="9px" y={`${20 * i + 42}`} className="component-nudges__link">
                  {n}
                </text>
              </Link>
            </>
          );
        })}
      </svg>
    </div>
  ) : (
    emptyState
  );
};

export default ComponentNudgesSVG;
