import dynamic from 'next/dynamic';
import React from 'react';

const MapClient = dynamic(() => import('./InfrastructureMap.client'), { ssr: false });

type Props = {
  city?: string;
  state?: string;
  lat?: number;
  lon?: number;
  radius?: number;
  className?: string;
};

export default function InfrastructureMap(props: Props) {
  return <div className={props.className ?? ''}><MapClient {...props} /></div>;
}
