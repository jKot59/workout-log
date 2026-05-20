import { Flex, Menu, Skeleton } from 'antd';
import styles from './siderMenu.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TuseAppSiderLogic } from '../../model/useAppSiderLogic';
import { MenuItem } from '../../model/types';

interface ISiderMenuProps {
  menuItems: TuseAppSiderLogic['state']['menuItems'];
  isMenuItemsLoading: TuseAppSiderLogic['state']['isMenuItemsLoading'];
}

function createMenuItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export function SiderMenu({ menuItems, isMenuItemsLoading }: ISiderMenuProps) {
  const pathname = usePathname();

  if (isMenuItemsLoading)
    return (
      <Flex gap={'8px'} className={styles.skeleton} vertical>
        <Skeleton.Button active block className={styles.skeleton_button} />
        <Skeleton.Button active block className={styles.skeleton_button} />
      </Flex>
    );

  if (!menuItems.length) return <div className={styles.empty_day}>No trainings</div>;

  return (
    <Menu
      className={styles.menu}
      selectedKeys={[pathname]}
      theme='dark'
      mode='inline'
      items={menuItems.map((day) =>
        createMenuItem(
          <Link data-testid='training day' href={day} className={styles.day}>
            {day}
          </Link>,
          '/' + day
        )
      )}
    />
  );
}
