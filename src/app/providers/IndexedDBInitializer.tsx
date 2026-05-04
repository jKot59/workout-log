'use client';

import { useProgramsStore } from '@/stores/programs-store';
import { useEffect } from 'react';

export function IndexedDBInitializer() {
  const { db, initializeDB } = useProgramsStore();

  useEffect(() => {
    if (!db) initializeDB();
  }, []);
  return null;
}
