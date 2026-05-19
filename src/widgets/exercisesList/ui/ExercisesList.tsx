'use client';

import { useProgramsStore } from '@/stores/programs-store';
import styles from './exercisesList.module.scss';
import { ExercisesItem } from './ExercisesItem';
import { Flex, Skeleton } from 'antd';
import { useParams } from 'next/navigation';
import { DayOfWeek } from '@/widgets/appSider';

export function ExercisesList() {
  const { programs, isLoading } = useProgramsStore();
  const { workout_day: day }: { workout_day: DayOfWeek } = useParams();

  if (isLoading || programs === null) return <Skeleton.Button block active style={{ height: '296px' }} />;

  return (
    <Flex vertical gap={'medium'}>
      {programs
        .find((program) => program.name === day)
        ?.exercises.map((exercise) => (
          <ExercisesItem key={exercise.name} name={exercise.name} sets={exercise.sets} />
        ))}
    </Flex>
  );
}
