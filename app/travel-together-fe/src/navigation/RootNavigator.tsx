import React from 'react';

export const navigationRef = React.createRef<any>();
export const isMountedRef = React.createRef<boolean>();

export const navigate = (name: string, params: any) => {
  if (isMountedRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
};