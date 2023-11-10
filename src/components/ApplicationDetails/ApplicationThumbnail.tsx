import * as React from 'react';
import asset1 from '../../imgs/app-thumbnails/Asset 1.svg';
import asset10 from '../../imgs/app-thumbnails/Asset 10.svg';
import asset2 from '../../imgs/app-thumbnails/Asset 2.svg';
import asset3 from '../../imgs/app-thumbnails/Asset 3.svg';
import asset4 from '../../imgs/app-thumbnails/Asset 4.svg';
import asset5 from '../../imgs/app-thumbnails/Asset 5.svg';
import asset6 from '../../imgs/app-thumbnails/Asset 6.svg';
import asset7 from '../../imgs/app-thumbnails/Asset 7.svg';
import asset8 from '../../imgs/app-thumbnails/Asset 8.svg';
import asset9 from '../../imgs/app-thumbnails/Asset 9.svg';
import { ApplicationKind } from '../../types';

const ICONS = [asset1, asset2, asset3, asset4, asset5, asset6, asset7, asset8, asset9, asset10];

export const THUMBNAIL_ANNOTATION = 'application.thumbnail';

export const getRandomSvgNumber = () => Math.floor(Math.random() * ICONS.length);

const getThumbnailFromApplication = (application: ApplicationKind) => {
  const index = application.metadata.annotations[THUMBNAIL_ANNOTATION];
  return index ? ICONS[parseInt(index, 10)] : ICONS[0];
};

export const ApplicationThumbnail: React.FC<
  React.PropsWithChildren<{ application: ApplicationKind }>
> = ({ application }) => {
  const icon = getThumbnailFromApplication(application);
  return (
    <img style={{ height: '70px', verticalAlign: 'top' }} src={icon} alt="Application thumbnail" />
  );
};
