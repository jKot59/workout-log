import { IndexedDBManager } from '@/shared/lib/indexedDB/IndexedDBManager';
import { DayOfWeek } from '@/widgets/appSider';
import { create } from 'zustand';

export interface IExercise {
  name: string;
  sets?: { date: string; reps: number[] }[];
}

interface IProgram {
  name: DayOfWeek;
  exercises: IExercise[];
}

interface IProgramsStore {
  programs: IProgram[] | null;
  db: IndexedDBManager | null;
  isLoading: boolean;
  update: (exercise: IProgram[]) => void;
  initializeDB: () => Promise<void>;
}

export const useProgramsStore = create<IProgramsStore>((set) => ({
  db: null,
  programs: null,
  isLoading: false,
  update: (programs) => set(() => ({ programs })),
  initializeDB: async () => {
    set({ isLoading: true });
    const db = new IndexedDBManager('WorkoutLogDatabase', 1, 'exercises');
    await db.openDB();
    const programs = await db.getAllItems();
    set({ db, programs, isLoading: false });
  },
}));
