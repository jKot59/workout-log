import { useProgramsStore } from '@/stores/programs-store';

export function useIndexedDBSyncWithZustand() {
  const { db, updateProgramsStore } = useProgramsStore();

  const syncDBWithZustand = async () => {
    const programs = await db?.getAllItems();
    if (programs) updateProgramsStore(programs);
  };

  return { syncDBWithZustand };
}
