'use client';

import {useEffect, useState} from 'react';

export function useAdminAuth(initial = false) {
  const [isAdmin, setIsAdmin] = useState(initial);

  useEffect(() => {
    // MVP: middleware protects routes, this is just UI state.
    setIsAdmin(true);
  }, []);

  return {isAdmin};
}
