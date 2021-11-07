import * as React from 'react';

export type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

export type LoadErrorProps = {
  label: string;
  className?: string;
  message?: string;
  canRetry?: boolean;
};

export type LoadingProps = {
  className?: string;
};

export type LoadingBoxProps = {
  className?: string;
  message?: string;
};

export type EmptyBoxProps = {
  label?: string;
};

export type MsgBoxProps = {
  title?: string;
  detail?: React.ReactNode;
  className?: string;
};

export type AccessDeniedProps = {
  message?: string;
};

export type DataProps = {
  NoDataEmptyMsg?: React.ComponentType;
  EmptyMsg?: React.ComponentType;
  label?: string;
  unfilteredData?: any;
  data?: any;
  children?: React.ReactNode;
};

export type StatusBoxProps = {
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
