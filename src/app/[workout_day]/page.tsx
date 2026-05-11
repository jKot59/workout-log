import { DeleteWorkoutDayBtn } from '@/features/deleteWorkoutDayBtn';
import styles from './workout_day.module.scss';

import { AddExerciseDrawer } from '@/features/exercise';
import { DayOfWeek } from '@/widgets/appSider';
import { ExercisesList } from '@/widgets/exercisesList';
import { Flex } from 'antd';

interface PageProps {
  params: Promise<{ workout_day: DayOfWeek }>;
}

export default async function TrainingDayPage({ params }: PageProps) {
  const { workout_day } = await params;

  return (
    <section className={styles.page}>
      <Flex justify={'center'} align={'center'}>
        <h1>{workout_day}</h1>
        <DeleteWorkoutDayBtn day={workout_day} className={styles.delete_btn} />
      </Flex>

      <AddExerciseDrawer day={workout_day} />
      <ExercisesList />
    </section>
  );
}
