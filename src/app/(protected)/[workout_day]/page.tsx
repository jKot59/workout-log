import styles from './workout_day.module.scss';

import { AddExerciseDrawer } from '@/features/exercise';
import { DayOfWeek } from '@/widgets/appSider';
import { ExercisesList } from '@/widgets/exercisesList';
import { Flex } from 'antd';
import { DeleteExerciseRecordBtn } from '@/features/deleteExerciseRecordBtn/ui/DeleteExerciseRecordBtn';

interface PageProps {
  params: Promise<{ workout_day: DayOfWeek }>;
}

export default async function TrainingDayPage({ params }: PageProps) {
  const { workout_day } = await params;

  return (
    <section className={styles.page}>
      <Flex justify={'center'} align={'center'}>
        <h1>{workout_day}</h1>
        <DeleteExerciseRecordBtn data-testid='delete day btn' day={workout_day} className={styles.delete_btn} />
      </Flex>
      <Flex vertical gap='medium'>
        <AddExerciseDrawer day={workout_day} />
        <ExercisesList />
      </Flex>
    </section>
  );
}
