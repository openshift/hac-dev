import * as React from 'react';
import ReleasesListView from '../../../components/Releases/ReleasesListView';

type ReleasesProps = {
  applicationName: string;
};

const ReleasesTab: React.FC<React.PropsWithChildren<ReleasesProps>> = ({ applicationName }) => (
  <ReleasesListView applicationName={applicationName} />
);

export default ReleasesTab;
