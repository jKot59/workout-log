import { IExercise, useProgramsStore } from '@/stores/programs-store';
import { DayOfWeek } from '@/widgets/appSider';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DataType } from '../ui/ExercisesItem';
import { transformDateToUserFriendly } from '@/shared/lib/helpers/transformDateToUserFriendly';

interface UseExercisesItemProps {
  exerciseName: string;
  initialSets?: IExercise['sets'];
}

export function useExercisesItemLogic({ exerciseName, initialSets }: UseExercisesItemProps) {
  const { workout_day: day }: { workout_day: DayOfWeek } = useParams();

  const [dataSource, setDataSource] = useState<Required<IExercise>['sets']>([]);

  const { db } = useProgramsStore();

  const updateExerciseSetReps = async (newData: typeof dataSource) => {
    if (!db) throw new Error('Database not initialized');

    const programData = await db.getItemByProgramName(day);

    if (!programData) throw new Error(`Program for ${day} not found`);

    const exerciseIndex = programData.exercises.findIndex((e: IExercise) => e.name === exerciseName);
    if (exerciseIndex === -1) throw new Error(`Exercise ${exerciseName} not found`);

    const exercise = programData?.exercises[exerciseIndex];

    if (exercise?.sets) {
      exercise.sets = newData;
    } else if (exercise) {
      exercise['sets'] = newData;
    }

    await db?.updateItem({ name: day, exercises: programData?.exercises ?? [] });
  };

  const handleDelete = async (key: DataType['date']) => {
    const newData = dataSource?.filter((item) => item.date !== key);
    setDataSource(newData);

    updateExerciseSetReps(newData);
  };

  const handleAdd = async () => {
    const date = transformDateToUserFriendly(new Date().toString());

    const newData: DataType = {
      date: date,
      reps: [0, 0, 0],
    };

    setDataSource([...dataSource, newData]);

    updateExerciseSetReps([newData]);
  };

  const handleSave = async (updatedRow: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => updatedRow.date === item.date);

    newData.splice(index, 1, updatedRow);
    setDataSource(newData);

    updateExerciseSetReps(newData);
  };

  useEffect(() => {
    if (!initialSets) return;

    setDataSource(initialSets);
  }, []);

  return {
    state: {
      dataSource,
    },
    handlers: {
      handleAdd,
      handleSave,
      handleDelete,
    },
  };
}
