import styles from './workout_day.module.scss';

import { AddExerciseDrawer } from '@/features/exercise';
import { DayOfWeek } from '@/widgets/appSider';
import { ExercisesList } from '@/widgets/exercisesList';

interface PageProps {
  params: Promise<{ workout_day: DayOfWeek }>;
}

export default async function TrainingDayPage({ params }: PageProps) {
  const { workout_day } = await params;

  return (
    <section className={styles.page}>
      <h1>{workout_day}</h1>

      <ExercisesList />
      <AddExerciseDrawer day={workout_day} />
    </section>
  );
}
