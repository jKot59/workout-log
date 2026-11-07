'use client';

import { Button, ButtonProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './deleteProgramExerciseBtn.module.scss';
import { DayOfWeek } from '@/widgets/appSider';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiFetch from '@/lib/apiFetch';
import { IProgram } from '@/shared/types/workout';

interface DeleteProgramExerciseBtnProps extends ButtonProps {
  programExerciseId: number;
}

export function DeleteProgramExerciseBtn({ programExerciseId, ...restProps }: DeleteProgramExerciseBtnProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteProgramExercise = useMutation({
    mutationFn: async () => {
      return apiFetch('api/user-programs/delete-exercise', {
        method: 'DELETE',
        body: JSON.stringify({ programExerciseId }),
      });
    },

    //TODO useOptimistic
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userExercises'] }),
  });

  const onDelete = async () => {
    // const data = await queryClient.getQueryData<IProgram[]>(['allPrograms']);
    // const deletedProgramId = data?.find((program) => program.name === day)?.id;

    // if (deletedProgramId) {
    deleteProgramExercise.mutate();
    // queryClient.setQueryData<IProgram[]>(['allPrograms'], (current = []) => {
    //   return current.filter((program) => program.id !== deletedProgramId);
    // });
    // }
  };

  return (
    <Button
      className={`${styles.button} ${restProps.className || ''}`}
      type={'text'}
      danger
      icon={<DeleteOutlined className={styles.icon} />}
      onClick={onDelete}
      {...restProps}
    />
  );
}
