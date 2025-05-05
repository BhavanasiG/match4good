'use client';

import dynamic from 'next/dynamic';
import type { FC } from 'react';

// eslint-disable-next-line @typescript-eslint/naming-convention
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
});

interface MapWrapperProps {
  address: string;
  postcode: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const MapWrapper: FC<MapWrapperProps> = ({ address, postcode }) => {
  return <MapComponent address={address} postcode={postcode} />;
};

export default MapWrapper;
