import { IEquipmentStore } from '@/stores/equipment-store';
import { DayOfWeek } from '@/widgets/appSider';

export interface OneSet {
  id: number;
  setNumber: number;
  reps: string;
  equipmentList: IEquipmentStore['equipmentList'];
}

export interface IExercise {
  id: number;
  catalogExerciseId: number;
  exerciseRecords: IExerciseRecord[];
}

export interface IExerciseRecord {
  id: number;
  date: Date;
  exerciseSets: OneSet[];
}

export interface IProgram {
  id: number;
  name: string;
  programExercises: IExercise[];
}

export interface ICatalogExercise {
  id: number;
  name: string;
  image?: string; // Can be base64 string, URL, or blob
  imageType?: 'url' | 'base64' | 'blob';
  description?: string;
  muscleGroup?: string;
}
