import { DayOfWeek } from '@/widgets/appSider';

export interface OneSet {
  date: string;
  reps: (string | undefined)[];
  equipmentList: {
    name: string;
  }[];
}

export interface IExercise {
  name: string;
  sets?: OneSet[];
}

export interface IProgram {
  name: DayOfWeek;
  exercises: IExercise[];
}
