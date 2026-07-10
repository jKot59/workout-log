import { useProgramsStore } from '@/stores/programs-store';

export function useIndexedDBSyncWithZustand() {
  const { db, updateProgramsStore } = useProgramsStore();

  const syncDBWithZustand = async () => {
    try {
      if (!db) {
        console.warn('Database not initialized. Skipping sync.');
        return { error: 'Database not initialized' };
      }

      const programs = await db.getAllItems();
      updateProgramsStore(programs);
      return { success: true };
    } catch (error) {
      console.error('Failed to sync IndexedDB with Zustand:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return { syncDBWithZustand };
}
