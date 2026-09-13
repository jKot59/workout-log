import { useIndexedDBSyncWithZustand } from '@/shared/lib/hooks/useIndexedDBSyncWithZustand';
import { ExercisesDatabase, IExerciseItem } from '@/shared/lib/indexedDB/ExercisesDatabase';
import { useProgramsStore } from '@/stores/programs-store';
import { DayOfWeek } from '@/widgets/appSider';
import { useQuery } from '@tanstack/react-query';
import { Form } from 'antd';
import { useState } from 'react';

export function useAddExerciseDrawerLogic(day: DayOfWeek) {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const { db } = useProgramsStore();
  const { syncDBWithZustand } = useIndexedDBSyncWithZustand();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [exercisesDB, setExercisesDB] = useState<ExercisesDatabase | null>(null);

  const showDrawer = () => setIsDrawerOpened(true);
  const onCloseDrawer = () => setIsDrawerOpened(false);

  const [form] = Form.useForm();

  const { data: exercises = [] } = useQuery<IExerciseItem[]>({
    queryKey: ['exercises'],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/exercises`).then((res) => res.json()),
    retry: false,
  });

  // Helper function to safely extract thumbUrl
  const getThumbUrlFromForm = (imageField: unknown): string | undefined => {
    if (Array.isArray(imageField) && imageField[0]?.thumbUrl) {
      return imageField[0].thumbUrl;
    }
    return undefined;
  };

  const handleSubmitNewExercise = async () => {
    try {
      const values: IExerciseItem = await form.validateFields();

      if (!exercisesDB) return console.log('no db found');

      await exercisesDB.addExercise({
        name: values.name,
        image: getThumbUrlFromForm(values.image),
        muscleGroup: values.muscleGroup,
      });

      // await loadExercises(exercisesDB);

      form.resetFields();
      setIsModalOpened(false);
    } catch {
      // validation errors
    }
  };

  const selectExerciseForTraining = async (exercise: string) => {
    const programData = await db?.getProgramByName(day);

    programData?.exercises.push({ name: exercise });

    await db?.updateItem({ name: day, exercises: programData?.exercises ?? [] });
    syncDBWithZustand();

    onCloseDrawer();
  };

  const handleDeleteExercise = async (id: number) => {
    if (exercisesDB) {
      await exercisesDB.deleteExerciseById(id);
      // await loadExercises(exercisesDB);
    }
  };

  return {
    state: {
      form,
      exercises,
      isModalOpened,
      isDrawerOpened,
    },
    handlers: {
      showDrawer,
      onCloseDrawer,
      setIsModalOpened,
      handleSubmitNewExercise,
      selectExerciseForTraining,
    },
  };
}
