'use client';

import { Button } from '@/shared/ui/button/Button';
import Sider from 'antd/es/layout/Sider';
import { ViewTransition } from 'react';
import { useAppSiderLogic } from '../model/useAppSiderLogic';
import styles from './appSider.module.scss';
import { SiderMenu } from './SiderMenu/SiderMenu';

export function AppSider({ aboveMenuSlot }: Readonly<{ aboveMenuSlot: React.ReactNode }>) {
  const { state, handlers } = useAppSiderLogic();

  return (
    <Sider collapsible collapsed={state.collapsed} onCollapse={(value) => handlers.setCollapsed(value)}>
      {aboveMenuSlot}

      <SiderMenu menuItems={state.menuItems} isMenuItemsLoading={state.isMenuItemsLoading} />

      <div className={styles.days_list}>
        {state.availableDays.length && (
          <Button className={styles.btn} onClick={handlers.toggleDaysList}>
            {state.isAvailableDaysListShown ? 'Cancel' : 'Add day'}
          </Button>
        )}

        {state.isAvailableDaysListShown && (
          <ViewTransition default={'none'} enter='slide-up' exit='slide-down'>
            <ul data-testid='days list' className={styles.list}>
              {state.availableDays.map((day) => (
                <li data-testid='day item' key={day} onClick={() => handlers.handleSelectDay(day)}>
                  {day}
                </li>
              ))}
            </ul>
          </ViewTransition>
        )}
      </div>
    </Sider>
  );
}
