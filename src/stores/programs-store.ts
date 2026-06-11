import { ProgramDatabase } from '@/shared/lib/indexedDB/ProgramDatabase';
import { DayOfWeek } from '@/widgets/appSider';
import { DataType } from '@/widgets/exercisesList';
import { create } from 'zustand';

export interface IExercise {
  name: string;
  sets?: { date: string; reps: DataType['reps'] }[];
}

interface IProgram {
  name: DayOfWeek;
  exercises: IExercise[];
}

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
