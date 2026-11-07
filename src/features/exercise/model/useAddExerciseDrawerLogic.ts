import apiFetch from '@/lib/apiFetch';
import { ICatalogExercise, IProgram } from '@/shared/types/workout';
import { DayOfWeek } from '@/widgets/appSider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Form } from 'antd';
import { useState } from 'react';

export function useAddExerciseDrawerLogic(day: DayOfWeek) {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const queryClient = useQueryClient();

  const showDrawer = () => setIsDrawerOpened(true);
  const onCloseDrawer = () => setIsDrawerOpened(false);

  const [form] = Form.useForm();

  const { data: exercises = [] } = useQuery<ICatalogExercise[]>({
    queryKey: ['catalogExercises'],
    queryFn: () => apiFetch('api/exercises').then((res) => res.json()),
    retry: false,
  });

  const addExerciseToProgram = useMutation({
    mutationFn: async ({ programId, exerciseId }: { programId: IProgram['id']; exerciseId: ICatalogExercise['id'] }) => {
      return apiFetch('api/user-programs/add-exercise', {
        method: 'POST',
        body: JSON.stringify({ programId, exerciseId }),
      });
    },

    //TODO useOptimistic
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userExercises'] }),
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
      // const values: ICatalogExercise = await form.validateFields();

      // if (!exercisesDB) return console.log('no db found');

      // await exercisesDB.addExercise({
      //   name: values.name,
      //   image: getThumbUrlFromForm(values.image),
      //   muscleGroup: values.muscleGroup,
      // });

      // // await loadExercises(exercisesDB);

      // form.resetFields();
      setIsModalOpened(false);
    } catch {
      // validation errors
    }
  };

  const selectExerciseForTraining = async (exerciseId: ICatalogExercise['id']) => {
    const data = queryClient.getQueryData<IProgram[]>(['allPrograms']);
    const programId = data?.find((program) => program.name === day)?.id;

    if (!programId) throw new Error('Program where to add selected exercise is not exist');

    addExerciseToProgram.mutate({ programId, exerciseId });
    onCloseDrawer();
  };

  const handleDeleteExercise = async (id: number) => {
    // if (exercisesDB) {
    //   await exercisesDB.deleteExerciseById(id);
    // await loadExercises(exercisesDB);
    // }
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
