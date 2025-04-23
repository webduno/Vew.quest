'use client';
import { useState, useEffect } from 'react';


export const VersionTag = () => {
  const [version, setVersion] = useState<string>('');
  useEffect(() => {
    console.log("process.env.VEW_PUBLIC_VERSION");
    console.log(process.env.VEW_PUBLIC_VERSION);
    setVersion(process.env.VEW_PUBLIC_VERSION || '0.42');
  }, []);
  return <span className='tx-xs'>(v{version})</span>;
};
