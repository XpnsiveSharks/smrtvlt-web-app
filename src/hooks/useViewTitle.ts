import { useEffect } from 'react';

export const useViewTitle = (label: string) => {
  useEffect(() => {
    document.title = `${label} | SmartVault`;
  }, [label]);

  return label;
};
