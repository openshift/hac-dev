import * as React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Alert, Button } from '@patternfly/react-core';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import * as restrictedSignImg from '../../../imgs/restricted-sign.svg';
import { TimeoutError } from '../../utils/error/http-error';

import './StatusBox.scss';

export const Box: React.FC<BoxProps> = ({ children, className }) => (
  <div className={classNames('status-box', className)}>{children}</div>
);

export const LoadError: React.FC<LoadErrorProps> = ({
  label,
  className,
  message,
  canRetry = true,
}) => {
  const { t } = useTranslation();
  return (
    <Box className={className}>
      <div className="pf-u-text-align-center cos-error-title">
        {isString(message)
          ? t('public~Error Loading {{label}}: {{message}}', {
              label,
              message,
            })
          : t('public~Error Loading {{label}}', { label })}
      </div>
      {canRetry && (
        <div className="pf-u-text-align-center">
          <Trans ns="public">
            Please{' '}
            <Button
              type="button"
              onClick={window.location.reload.bind(window.location)}
              variant="link"
              isInline
            >
              try again
            </Button>
            .
          </Trans>
        </div>
      )}
    </Box>
  );
};
LoadError.displayName = 'LoadError';

export const Loading: React.FC<LoadingProps> = ({ className }) => (
  <div className={classNames('loader', className)} data-test="loading-indicator">
    <div className="loader-dot__one" />
    <div className="loader-dot__two" />
    <div className="loader-dot__three" />
  </div>
);
Loading.displayName = 'Loading';

export const LoadingInline: React.FC<{}> = () => <Loading className="loader--inline" />;
LoadingInline.displayName = 'LoadingInline';

export const LoadingBox: React.FC<LoadingBoxProps> = ({ className, message }) => (
  <Box className={classNames('status-box--loading', className)}>
    <Loading />
    {message && <div className="status-box__loading-message">{message}</div>}
  </Box>
);
LoadingBox.displayName = 'LoadingBox';

export const EmptyBox: React.FC<EmptyBoxProps> = ({ label }) => {
  return (
    <Box>
      <div data-test="empty-message" className="pf-u-text-align-center">
        {label ? `No ${label} found` : 'Not found'}
      </div>
    </Box>
  );
};
EmptyBox.displayName = 'EmptyBox';

export const MsgBox: React.FC<MsgBoxProps> = ({ title, detail, className = '' }) => (
  <Box className={className}>
    {title && (
      <div className="status-box__title" data-test="msg-box-title">
        {title}
      </div>
    )}
    {detail && (
      <div className="pf-u-text-align-center status-box__detail" data-test="msg-box-detail">
        {detail}
      </div>
    )}
  </Box>
);
MsgBox.displayName = 'MsgBox';

export const AccessDenied: React.FC<AccessDeniedProps> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div>
      <Box className="pf-u-text-align-center">
        <img className="status-box__access-denied-icon" src={restrictedSignImg} />
        <MsgBox
          title={t('public~Restricted Access')}
          detail={t("public~You don't have access to this section due to cluster policy.")}
        />
      </Box>
      {isString(message) && (
        <Alert isInline variant="danger" title={t('public~Error details')}>
          {message}
        </Alert>
      )}
    </div>
  );
};
AccessDenied.displayName = 'AccessDenied';

const Data: React.FC<DataProps> = ({
  NoDataEmptyMsg,
  EmptyMsg,
  label,
  data,
  unfilteredData,
  children,
}) => {
  if (NoDataEmptyMsg && isEmpty(unfilteredData)) {
    return (
      <div className="loading-box loading-box__loaded">
        {NoDataEmptyMsg ? <NoDataEmptyMsg /> : <EmptyBox label={label} />}
      </div>
    );
  }

  if (!data || isEmpty(data)) {
    return (
      <div className="loading-box loading-box__loaded">
        {EmptyMsg ? <EmptyMsg /> : <EmptyBox label={label} />}
      </div>
    );
  }
  return <div className="loading-box loading-box__loaded">{children}</div>;
};
Data.displayName = 'Data';

export const StatusBox: React.FC<StatusBoxProps> = (props) => {
  const { loadError, loaded, skeleton, ...dataProps } = props;
  const { t } = useTranslation();

  if (loadError) {
    const status = get(loadError, 'response.status');
    if (status === 404) {
      return (
        <div className="pane-body">
          <h1 className="pane__heading pane__heading--center">{t('public~404: Not Found')}</h1>
        </div>
      );
    }
    if (status === 403) {
      return <AccessDenied message={loadError.message} />;
    }

    if (loaded && loadError instanceof TimeoutError) {
      return (
        <Data {...dataProps}>
          <div className="timeout-error text-muted">
            {t('public~Timed out fetching new data. The data below is stale.')}
          </div>
          {props.children}
        </Data>
      );
    }

    return (
      <LoadError
        message={loadError.message}
        label={props.label}
        className="loading-box loading-box__errored"
      />
    );
  }

  if (!loaded) {
    return skeleton ? <>{skeleton}</> : <LoadingBox className="loading-box loading-box__loading" />;
  }
  return <Data {...dataProps} />;
};
StatusBox.displayName = 'StatusBox';

type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

type LoadErrorProps = {
  label: string;
  className?: string;
  message?: string;
  canRetry?: boolean;
};

type LoadingProps = {
  className?: string;
};

type LoadingBoxProps = {
  className?: string;
  message?: string;
};

type EmptyBoxProps = {
  label?: string;
};

type MsgBoxProps = {
  title?: string;
  detail?: React.ReactNode;
  className?: string;
};

type AccessDeniedProps = {
  message?: string;
};

type DataProps = {
  NoDataEmptyMsg?: React.ComponentType;
  EmptyMsg?: React.ComponentType;
  label?: string;
  unfilteredData?: any;
  data?: any;
  children?: React.ReactNode;
};

type StatusBoxProps = {
  label?: string;
  loadError?: any;
  loaded?: boolean;
  data?: any;
  unfilteredData?: any;
  skeleton?: React.ReactNode;
  NoDataEmptyMsg?: React.ComponentType;
  EmptyMsg?: React.ComponentType;
  children?: React.ReactNode;
};
