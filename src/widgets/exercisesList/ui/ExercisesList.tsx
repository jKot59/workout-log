'use client';

import styles from './exercisesList.module.scss';
import { ExercisesItem } from './ExercisesItem';
import { Flex, Skeleton } from 'antd';
import { useParams } from 'next/navigation';
import { DayOfWeek } from '@/widgets/appSider';
import { useQuery } from '@tanstack/react-query';
import apiFetch from '@/lib/apiFetch';
import { IProgram } from '@/shared/types/workout';

export function ExercisesList() {
  const { workout_day: day }: { workout_day: DayOfWeek } = useParams();

  const { data: programs = [], isLoading } = useQuery<IProgram[]>({
    queryKey: ['userExercises'],
    queryFn: async () => apiFetch('api/user-programs/exercises').then((res) => res.json()),
    retry: false,
  });

  if (isLoading) return <Skeleton.Button block active style={{ height: '296px' }} />;

  return (
    <Flex vertical gap={'medium'}>
      {programs
        .find((program) => program.name.toLocaleLowerCase() === day.toLocaleLowerCase())
        ?.programExercises.map((exercise) => (
          <ExercisesItem key={exercise.id} exercise={exercise} />
        ))}
    </Flex>
  );
}
