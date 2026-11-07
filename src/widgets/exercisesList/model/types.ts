import { IExerciseRecord, OneSet } from '@/shared/types/workout';

export type EditableCellDataIndex = `${number}`;

export interface IEditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: EditableCellDataIndex;
  record: IExerciseRecord;
  handleSave: (exerciseSetId: OneSet['id'], setNumber: OneSet['setNumber'], reps: OneSet['reps']) => void;
  columnIndex: number;
  totalColumns?: number;
  currentRowKey?: string;
}
