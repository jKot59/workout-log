'use client';

import { Button } from '@/shared/ui/button/Button';
import { DayOfWeek } from '@/widgets/appSider';
import { Drawer } from 'antd';
import { useAddExerciseDrawerLogic } from '../model/useAddExerciseDrawerLogic';
import Image from 'next/image';
import styles from './addExerciseDrawer.module.scss';

const exercisesList = [
  { name: 'Bulgarian split squats', imageURL: '/images/exercises/bulgarian_split_squats.jpeg' },
  { name: 'Calf raises', imageURL: '/images/exercises/calf_raises.jpeg' },
  { name: 'Hindu push-ups', imageURL: '/images/exercises/hindu_pushups.jpeg' },
  { name: 'Parallel bar dips', imageURL: '/images/exercises/dips.jpeg' },
  { name: 'Pull-ups', imageURL: '/images/exercises/pull_ups.jpeg' },
  { name: 'Knee to chest on parallel bars', imageURL: '/images/exercises/knees_to_chest.jpeg' },
  { name: 'Biceps pull-ups', imageURL: '/images/exercises/biceps_pull_ups.jpeg' },
];

export function AddExerciseDrawer({ day }: { day: DayOfWeek }) {
  const { state, handlers } = useAddExerciseDrawerLogic(day);

  return (
    <>
      <Button onClick={handlers.showDrawer}>Add exercise</Button>

      <Drawer title='Select the exercise' placement='bottom' closable={false} onClose={handlers.onClose} open={state.open}>
        <div className={styles.drawer_content}>
          {exercisesList.map((exercise) => (
            <div key={exercise.name} className={styles.exercise} onClick={() => handlers.addNewExercise(exercise.name)}>
              {exercise.name}
              {exercise.imageURL && (
                <div className={styles.image_wrapper}>
                  <Image className={styles.image} src={exercise.imageURL} alt={exercise.name} fill sizes='200px 200px' loading='lazy' />
                </div>
              )}
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}
