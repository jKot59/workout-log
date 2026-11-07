'use client';

import { Button, ButtonProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './deleteExerciseRecordBtn.module.scss';
import { DayOfWeek } from '@/widgets/appSider';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiFetch from '@/lib/apiFetch';
import { IProgram } from '@/shared/types/workout';

interface DeleteExerciseRecordBtnProps extends ButtonProps {
  day: DayOfWeek;
}

export function DeleteExerciseRecordBtn({ day, ...restProps }: DeleteExerciseRecordBtnProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteProgram = useMutation({
    mutationFn: async (programId: number) => {
      apiFetch('api/user-programs/delete-program', {
        method: 'DELETE',
        body: JSON.stringify({ programId }),
      });
    },
  });

  const onDelete = async () => {
    const data = await queryClient.getQueryData<IProgram[]>(['allPrograms']);
    const deletedProgramId = data?.find((program) => program.name === day)?.id;

    if (deletedProgramId) {
      deleteProgram.mutate(deletedProgramId);
      queryClient.setQueryData<IProgram[]>(['allPrograms'], (current = []) => {
        return current.filter((program) => program.id !== deletedProgramId);
      });
      router.push('/');
    }
  };

  return (
    <Button
      className={`${styles.button} ${restProps.className || ''}`}
      type={'text'}
      danger
      icon={<DeleteOutlined className={styles.icon} />}
      size={'large'}
      onClick={onDelete}
      {...restProps}
    />
  );
}
