import Image from 'next/image';
import styles from './exercise.module.scss';
import { IExerciseItem } from '@/shared/lib/indexedDB/ExercisesDatabase';
import { HtmlHTMLAttributes } from 'react';
import { Flex } from 'antd';

interface IExerciseProps extends Pick<IExerciseItem, 'name' | 'image'>, HtmlHTMLAttributes<HTMLElement> {}

export function Exercise({ name, image, ...restProps }: IExerciseProps) {
  return (
    <Flex gap='small' className={`${styles.exercise} ${restProps.className}`} {...restProps}>
      {name}
      <div className={styles.image_wrapper}>
        <Image
          className={styles.image}
          src={image || '/images/exercises/image_not_found.jpeg'}
          alt={name}
          fill
          sizes='200px 200px'
          loading='lazy'
        />
      </div>
    </Flex>
  );
}
