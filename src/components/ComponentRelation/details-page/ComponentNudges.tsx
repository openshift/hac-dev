import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Text } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { css } from '@patternfly/react-styles';
import { useAllComponents } from '../../../hooks/useComponents';
import { ComponentKind } from '../../../types';
import { useWorkspaceInfo } from '../../../utils/workspace-context-utils';
import { ComponentRelationStatusIcon } from './ComponentRelationStatusIcon';

import './ComponentNudges.scss';

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
  const { workspace, namespace } = useWorkspaceInfo();
  const [components, loaded, error] = useAllComponents(namespace);

  const emptyState = (
    <div data-test="nudges-empty-state" className="component-nudges__empty-state">
      No dependencies found
    </div>
  );

  const relatedComponents = React.useMemo(() => {
    return loaded && !error
      ? components.filter((comp) => nudgeComponents?.includes(comp.metadata.name))
      : [];
  }, [components, error, loaded, nudgeComponents]);

  const isNudges = React.useMemo(() => radioChecked === NudgeRadios.NUDGES, [radioChecked]);

  if (!nudgeComponents || nudgeComponents?.length === 0) {
    return emptyState;
  }

  return Array.isArray(nudgeComponents) && nudgeComponents.length > 0 ? (
    <div
      className={css(
        'component-nudge',
        'component-nudge__tree',
        radioChecked === NudgeRadios.NUDGES && 'component-nudge__nudges-arrow',
        radioChecked === NudgeRadios.NUDGED_BY && 'component-nudge__nudged-by-arrow',
      )}
    >
      <Text style={{ marginTop: 'var(--pf-v5-global--spacer--lg)' }}>
        <b>{component.metadata.name}</b>
      </Text>
      <ul>
        {relatedComponents.map((comp, i) => (
          <li key={i} data-test="nudges-connector">
            <Link
              to={`/application-pipeline/workspaces/${workspace}/applications/${comp.spec?.application}/components/${comp.metadata.name}`}
              data-test={isNudges ? 'nudges-cmp-link' : 'nudged-by-cmp-link'}
            >
              {comp.metadata.name}
            </Link>
            <ComponentRelationStatusIcon
              component={comp}
              className="component-nudge__status-icon"
            />
            {comp.spec?.application !== component.spec?.application ? (
              <>
                (
                <Button
                  isInline
                  variant="link"
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="end"
                  component={(props) => (
                    <Link
                      {...props}
                      to={`/application-pipeline/workspaces/${workspace}/applications/${comp?.spec?.application}/`}
                      target="_blank"
                    />
                  )}
                >
                  {comp.spec?.application}
                </Button>
                )
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    emptyState
  );
};

export default ComponentNudgesSVG;
