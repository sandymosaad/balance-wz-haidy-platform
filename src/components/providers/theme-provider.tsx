'use client';

import {useEffect, type PropsWithChildren} from 'react';

export function ThemeProvider({children}: PropsWithChildren) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'art-therapy');
  }, []);

  return children;
}
