import { create } from 'zustand';

export interface IExercise {
  name: string;
  sets: [{ reps: number }, { reps: number }];
}

interface IProgram {
  name: string;
  exercises: IExercise[];
}

interface IProgramsStore {
  programs: IProgram[] | null;
  update: (exercise: IProgram[]) => void;
}

export const useProgramsStore = create<IProgramsStore>((set) => ({
  programs: null,
  update: (programs) => set(() => ({ programs })),
}));
