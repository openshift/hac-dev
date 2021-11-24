import React from 'react';
import classNames from 'classnames';
import { isObject } from 'lodash-es';
import { AlertGroup } from '@patternfly/react-core';
import { LoadingInline } from '../status-box/StatusBox';
import SuccessMessage from './SuccessMessage';
import ErrorMessage from './ErrorMessage';
import InfoMessage from './InfoMessage';

const injectDisabled = (children: React.ReactElement | React.ReactElement[], disabled: boolean) => {
  const childrenArray: React.ReactElement[] = Array.isArray(children) ? children : [children];
  return React.Children.map(childrenArray, (c) => {
    if (!isObject(c) || c.type !== 'button') {
      return c;
    }

    return React.cloneElement(c, { disabled: c.props.disabled || disabled });
  });
};

// NOTE: DO NOT use <a> elements within a ButtonBar.
// They don't support the disabled attribute, and therefore
// can't be disabled during a pending promise/request.
type ButtonBarProps = {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
  errorMessage?: React.ReactNode;
  infoMessage?: string;
  successMessage?: string;
  inProgress?: boolean;
};

const ButtonBar: React.FC<ButtonBarProps> = ({
  children,
  className,
  errorMessage,
  infoMessage,
  successMessage,
  inProgress,
}) => {
  return (
    <div className={classNames(className, 'hacDev-m-btn-bar')}>
      <AlertGroup aria-live="polite" aria-atomic="false" aria-relevant="additions text">
        {successMessage && <SuccessMessage message={successMessage} />}
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {injectDisabled(children, inProgress)}
        {inProgress && <LoadingInline />}
        {infoMessage && <InfoMessage message={infoMessage} />}
      </AlertGroup>
    </div>
  );
};

export default ButtonBar;
