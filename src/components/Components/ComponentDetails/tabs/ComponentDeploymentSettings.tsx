import * as React from 'react';
import { css } from '@patternfly/react-styles';
import isEmpty from 'lodash/isEmpty';
import lodashValues from 'lodash/values';
import { ComponentKind } from '../../../../types';
import { createResourceData } from '../../../ImportForm/utils/transform-utils';

type ComponentDeploymentSettingsProps = {
  component: ComponentKind;
};

const ComponentDeploymentSettings: React.FC<
  React.PropsWithChildren<ComponentDeploymentSettingsProps>
> = ({ component }) => {
  const { targetPort, resources, env: envs, replicas } = component.spec;
  const instances = replicas && Number(replicas);
  const resourceData = createResourceData(resources || {});
  const environmentVariables = React.useMemo(() => {
    return !isEmpty(envs) ? envs.map((env) => lodashValues(env)) : null;
  }, [envs]);

  return (
    <div>
      <div className="component-details__deployment-settings-table">
        <div className="component-details__deployment-settings-table--header m-is-setting">
          Settings
        </div>
        <div className="component-details__deployment-settings-table--header">Default</div>
        <div className="component-details__deployment-settings-table--setting">
          <span>CPU</span>
        </div>
        <div className="component-details__deployment-settings-table--value">
          <span>{resourceData.cpu}</span>
          <span>{resourceData.cpuUnit}</span>
        </div>
        <div className="component-details__deployment-settings-table--setting">
          <span>Memory</span>
        </div>
        <div className="component-details__deployment-settings-table--value">
          <span>{resourceData.memory}</span>
          <span>{resourceData.memoryUnit}</span>
        </div>
        <div className="component-details__deployment-settings-table--setting">
          <span>Instances</span>
        </div>
        <div className="component-details__deployment-settings-table--value">{instances}</div>
        <div className="component-details__deployment-settings-table--setting">
          <span>Target port</span>
        </div>
        <div className="component-details__deployment-settings-table--value">{targetPort}</div>
      </div>
      <div className="component-details__deployment-settings-table">
        <div className="component-details__deployment-settings-table--header m-is-setting">
          Variable
        </div>
        <div className="component-details__deployment-settings-table--header">Value</div>
        {environmentVariables?.map((env) => (
          <>
            <div
              key={env[0]}
              className={css(
                'component-details__deployment-settings-table--setting',
                !env[0] && 'm-is-hidden',
              )}
            >
              <span>{env[0] || 'N/A'}</span>
            </div>
            <div
              key={env[0]}
              className={css(
                'component-details__deployment-settings-table--value',
                !env[1] && 'm-is-hidden',
              )}
            >
              {env[1] || 'N/A'}
            </div>
          </>
        ))}
      </div>
      {!environmentVariables?.length ? (
        <div className="component-details__deployment-settings-table--empty-row">
          No environment variables
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(ComponentDeploymentSettings);
