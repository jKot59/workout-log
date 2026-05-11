'use client';

import { Button, ButtonProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './deleteWorkoutDayBtn.module.scss';
import { useProgramsStore } from '@/stores/programs-store';
import { DayOfWeek } from '@/widgets/appSider';
import { useIndexedDBSyncWithZustand } from '@/shared/lib/hooks/useIndexedDBSyncWithZustand';
import { useRouter } from 'next/navigation';

interface DeleteWorkoutDayBtnProps extends ButtonProps {
  day: DayOfWeek;
}

export function DeleteWorkoutDayBtn({ day, ...restProps }: DeleteWorkoutDayBtnProps) {
  const router = useRouter();
  const { db } = useProgramsStore();
  const { syncDBWithZustand } = useIndexedDBSyncWithZustand();

  const onDelete = async () => {
    db?.deleteItemByProgramName(day);

    router.push('/');
    syncDBWithZustand();
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
