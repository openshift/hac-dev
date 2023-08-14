import React from 'react';
import NamespacedPage from '../components/NamespacedPage/NamespacedPage';
import ErrorEmptyState from '../shared/components/empty-state/ErrorEmptyState';
import { HttpError } from '../shared/utils/error/http-error';

const NotFoundPage: React.FunctionComponent = () => (
  <NamespacedPage>
    <ErrorEmptyState httpError={HttpError.fromCode(404)} />
  </NamespacedPage>
);

export default NotFoundPage;
