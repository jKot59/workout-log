'use client';

import { useProgramsStore } from '@/stores/programs-store';
import styles from './exercisesList.module.scss';
import React, { useEffect } from 'react';
import { IndexedDBManager } from '@/shared/lib/indexedDB/IndexedDBManager';

export function ExercisesList() {
  const { programs, update } = useProgramsStore();

  useEffect(() => {
    (async () => {
      const db = new IndexedDBManager('WorkoutLogDatabase', 1, 'exercises');

      await db.openDB();
      const programs = await db.getAllItems();

      update(programs);
    })();
  }, []);

  return (
    <div className=''>
      {programs?.map((program) => (
        <React.Fragment key={program.name}>
          {program.exercises.map((exercise) => (
            <div key={exercise.name}>
              {exercise.name}
              <br />
              {exercise.sets.map((set, i) => `Set ${i + 1}: reps ${set.reps ?? 0} \n`)}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
