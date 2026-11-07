import { Flex, Menu, Skeleton } from 'antd';
import styles from './siderMenu.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TuseAppSiderLogic } from '../../model/useAppSiderLogic';
import { MenuItem } from '../../model/types';
import { useQuery } from '@tanstack/react-query';
import { IProgram } from '@/shared/types/workout';
import apiFetch from '@/lib/apiFetch';

function createMenuItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export function SiderMenu() {
  const pathname = usePathname();
  const { data: programs = [], isLoading: isProgramsLoading } = useQuery<IProgram[]>({
    queryKey: ['allPrograms'],
    queryFn: () => apiFetch('api/user-programs').then((res) => res.json()),
    retry: false,
  });

  if (isProgramsLoading)
    return (
      <div className={styles.skeleton}>
        <Skeleton.Button active block className={styles.skeleton_button} />
        <Skeleton.Button active block className={styles.skeleton_button} />
      </div>
    );

  if (!programs.length) return <div className={styles.empty_day}>No trainings</div>;

  return (
    <Menu
      className={styles.menu}
      selectedKeys={[pathname]}
      theme='dark'
      mode='inline'
      items={programs.map((day) =>
        createMenuItem(
          <Link data-testid='training day' href={day.name} className={styles.day}>
            {day.name}
          </Link>,
          '/' + day.name
        )
      )}
    />
  );
}
