import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const OLD_APP = 'app-studio';
const INTERIM_APP = 'stonesoup';
const NEW_APP = 'application-pipeline';

const RedirectPage: React.FunctionComponent = () => {
  const location = useLocation();

  const to = {
    pathname: location.pathname.replace(OLD_APP, NEW_APP).replace(INTERIM_APP, NEW_APP),
    search: location.search,
    hash: location.hash,
  };

  return <Navigate to={to} replace />;
};

export default RedirectPage;
