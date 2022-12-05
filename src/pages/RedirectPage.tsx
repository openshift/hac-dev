import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const OLD_APP = 'app-studio';
const NEW_APP = 'stonesoup';

const RedirectPage: React.FunctionComponent = () => {
  const location = useLocation();

  const to = {
    pathname: location.pathname.replace(OLD_APP, NEW_APP),
    search: location.search,
    hash: location.hash,
  };

  return <Navigate to={to} />;
};

export default RedirectPage;
