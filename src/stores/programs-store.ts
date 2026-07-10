import { ProgramDatabase } from '@/shared/lib/indexedDB/ProgramDatabase';
import { IProgram } from '@/shared/types/workout';
import { create } from 'zustand';

interface IProgramsStore {
  programs: IProgram[] | null;
  db: ProgramDatabase | null;
  isLoading: boolean;
  updateProgramsStore: (exercise: IProgram[]) => void;
  initializeDB: () => Promise<void>;
}

export const useProgramsStore = create<IProgramsStore>((set) => ({
  db: null,
  programs: null,
  isLoading: true,
  updateProgramsStore: (programs) => set(() => ({ programs })),
  initializeDB: async () => {
    set({ isLoading: true });
    const db = new ProgramDatabase();
    await db.openDB();
    const programs = await db.getAllItems();
    set({ db, programs, isLoading: false });
  },
}));
