import { IExercise, OneSet } from '@/shared/types/workout';
import { useProgramsStore } from '@/stores/programs-store';
import { DayOfWeek } from '@/widgets/appSider';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { transformDateToUserFriendly } from '@/shared/lib/helpers/transformDateToUserFriendly';
import { useIndexedDBSyncWithZustand } from '@/shared/lib/hooks/useIndexedDBSyncWithZustand';

interface UseExercisesItemProps {
  exerciseName: string;
  initialSets: IExercise['sets'];
}

export function useExercisesItemLogic({ exerciseName, initialSets = [] }: UseExercisesItemProps) {
  const { db } = useProgramsStore();
  const { syncDBWithZustand } = useIndexedDBSyncWithZustand();
  const { workout_day: day }: { workout_day: DayOfWeek } = useParams();

  const [dataSource, setDataSource] = useState<Required<IExercise>['sets']>([]);
  const [amountSets, setAmountSets] = useState(() =>
    initialSets.reduce((acc, curr) => {
      if (curr.reps.length > acc) acc = curr.reps.length;
      return acc;
    }, 0)
  );

  const updateExerciseSetReps = async (newData: typeof dataSource) => {
    if (!db) throw new Error('Database not initialized');

    const programData = await db.getProgramByName(day);

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

    syncDBWithZustand();
  };

  const handleDelete = async (key: OneSet['date']) => {
    const newData = dataSource?.filter((item) => item.date !== key);
    setDataSource(newData);
  };

  const handleAdd = async () => {
    const date = transformDateToUserFriendly(new Date().toString());

    const newData: OneSet = {
      date: date,
      reps: [, , ,],
      equipmentList: [],
    };

    setDataSource((prev) => [...prev, newData]);

    if (dataSource.length === 0) setAmountSets(newData.reps.length);
  };

  const handleAddSet = async () => {
    const newData = structuredClone(dataSource);

    const addedOneMoreSet = newData.map((item) => {
      item.reps.push();
      return item;
    });

    setAmountSets((prev) => prev + 1);
    setDataSource(addedOneMoreSet);
  };

  const handleAddEquipment = async (date: OneSet['date'], equipment: OneSet['equipmentList'][0]) => {
    const clonedDataSource = structuredClone(dataSource);

    const withAddedEquipment = clonedDataSource.map((item) => {
      if (item.date !== date) return item;

      return {
        ...item,
        equipmentList: [...(item.equipmentList ?? []), equipment],
      };
    });

    setDataSource(withAddedEquipment);
  };

  const handleRemoveEquipment = async (date: OneSet['date'], equipmentId: OneSet['equipmentList'][0]['id']) => {
    const newData = structuredClone(dataSource);

    const withoutEquipment = newData.map((item) => {
      if (item.date === date) {
        item.equipmentList = item.equipmentList.filter((equipment) => equipment.id !== equipmentId);
      }

      return item;
    });

    setDataSource(withoutEquipment);
  };

  const handleSave = async (updatedRow: OneSet) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => updatedRow.date === item.date);

    newData.splice(index, 1, updatedRow);
    setDataSource(newData);
  };

  useEffect(() => {
    if (!initialSets) return;

    setDataSource(initialSets);
  }, []);

  useEffect(() => {
    updateExerciseSetReps(dataSource);
  }, [dataSource]);

  return {
    state: {
      dataSource,
      amountSets,
    },
    handlers: {
      handleAdd,
      handleSave,
      handleDelete,
      handleAddSet,
      handleAddEquipment,
      handleRemoveEquipment,
    },
  };
}
