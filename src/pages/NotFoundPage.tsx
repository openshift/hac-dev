import React from 'react';
import ErrorEmptyState from '../components/EmptyState/ErrorEmptyState';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import { HttpError } from '../shared/utils/error/http-error';

const NotFoundPage: React.FunctionComponent = () => (
  <NamespacedPage>
    <ErrorEmptyState httpError={HttpError.fromCode(404)} />
  </NamespacedPage>
);

export default NotFoundPage;
