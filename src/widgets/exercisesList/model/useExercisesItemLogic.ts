import { ICatalogExercise, IExercise, IExerciseRecord, IProgram, OneSet } from '@/shared/types/workout';
import { DayOfWeek } from '@/widgets/appSider';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { transformDateToUserFriendly } from '@/shared/lib/helpers/transformDateToUserFriendly';
import { useEquipmentStore } from '@/stores/equipment-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiFetch from '@/lib/apiFetch';

export function useExercisesItemLogic(exercise: IExercise) {
  const { workout_day: day }: { workout_day: DayOfWeek } = useParams();
  const { equipmentList } = useEquipmentStore();

  // const [dataSource, setDataSource] = useState<Required<IExercise>['exerciseRecords']>([]);
  // const [amountSets, setAmountSets] = useState(() =>
  //   initialSets.reduce((acc, curr) => {
  //     if (curr.reps?.length > acc) acc = curr.reps.length;
  //     return acc;
  //   }, 0)
  // );

  const queryClient = useQueryClient();

  const catalogExercises = queryClient.getQueryData<ICatalogExercise[]>(['catalogExercises']);
  const getCatalogExerciseInfo = catalogExercises?.find((catalogExercise) => catalogExercise.id === exercise.catalogExerciseId);

  const addExerciseRecord = useMutation({
    mutationFn: async (programExerciseId: number) => {
      return apiFetch('api/user-programs/add-exercise-record', {
        method: 'POST',
        body: JSON.stringify({ programExerciseId }),
      });
    },
    //TODO avoid invalidation. use optimistic instead
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userExercises'] }),
  });

  const editExerciseRecord = useMutation({
    mutationFn: async ({
      exerciseSetId,
      setNumber,
      reps,
    }: {
      exerciseSetId: OneSet['id'];
      setNumber: OneSet['setNumber'];
      reps: OneSet['reps'];
    }) => {
      return apiFetch('api/user-programs/change-exercise', {
        method: 'POST',
        body: JSON.stringify({ exerciseSetId, setNumber, reps }),
      });
    },
  });

  const deleteExerciseRecord = useMutation({
    mutationFn: async (recordId: number) => {
      return apiFetch('api/user-programs/delete-record', {
        method: 'DELETE',
        body: JSON.stringify({
          recordId,
        }),
      });
    },
    //TODO avoid invalidation. use optimistic instead
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userExercises'] }),
  });

  const handleDelete = async (recordId: IExerciseRecord['id']) => {
    deleteExerciseRecord.mutate(recordId);
  };

  const onAddExerciseRecord = async (programExerciseId: IExercise['id']) => {
    addExerciseRecord.mutate(programExerciseId);
  };

  const handleAddSet = async () => {
    // const newData = structuredClone(dataSource);
    // const addedOneMoreSet = newData.map((item) => {
    //   item.reps.push();
    //   return item;
    // });
    // setAmountSets((prev) => prev + 1);
    // setDataSource(addedOneMoreSet);
  };

  const handleAddEquipment = async (date: OneSet['id'], equipment: OneSet['equipmentList'][0]) => {
    // const clonedDataSource = structuredClone(dataSource);
    // const withAddedEquipment = clonedDataSource.map((item) => {
    //   if (item.date !== date) return item;
    //   return {
    //     ...item,
    //     equipmentList: [...(item.equipmentList ?? []), equipment],
    //   };
    // });
    // setDataSource(withAddedEquipment);
  };

  const handleRemoveEquipment = async (date: OneSet['id'], equipmentId: OneSet['equipmentList'][0]['id']) => {
    // const newData = structuredClone(dataSource);
    // const withoutEquipment = newData.map((item) => {
    //   if (item.date === date) {
    //     item.equipmentList = item.equipmentList.filter((equipment) => equipment.id !== equipmentId);
    //   }
    //   return item;
    // });
    // setDataSource(withoutEquipment);
  };

  const handleSave = async (exerciseSetId: OneSet['id'], setNumber: OneSet['setNumber'], reps: OneSet['reps']) => {
    editExerciseRecord.mutate({ exerciseSetId, setNumber, reps });
  };

  // useEffect(() => {
  //   if (!initialSets) return;

  //   setDataSource(initialSets);
  // }, []);

  return {
    state: {
      // exercises,
      equipmentList,
      catalogExercise: getCatalogExerciseInfo,
    },
    handlers: {
      handleSave,
      handleDelete,
      handleAddSet,
      handleAddEquipment,
      onAddExerciseRecord,
      handleRemoveEquipment,
    },
  };
}
