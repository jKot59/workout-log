'use client';

import { Button } from '@/shared/button/Button';
import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { ViewTransition } from 'react';
import styles from './appSider.module.scss';
import { useAppSiderLogic } from '../model/useAppSiderLogic';

export function AppSider({ aboveMenuSlot }: Readonly<{ aboveMenuSlot: React.ReactNode }>) {
  const { state, handlers } = useAppSiderLogic();

  return (
    <Sider collapsible collapsed={state.collapsed} onCollapse={(value) => handlers.setCollapsed(value)}>
      {aboveMenuSlot}

      {state.items.length ? (
        <Menu className={styles.menu} theme='dark' mode='inline' items={state.items} />
      ) : (
        <div className={styles.empty_day}>No trainings</div>
      )}

      <div className={styles.days_list}>
        {state.availableDays.length && (
          <Button className={styles.btn} onClick={handlers.toggleDaysList}>
            {state.isAvailableDaysListShown ? 'Cancel' : 'Add day'}
          </Button>
        )}

        {state.isAvailableDaysListShown && (
          <ViewTransition default={'none'} enter='slide-up' exit='slide-down'>
            <ul className={styles.list}>
              {state.availableDays.map((day) => (
                <li key={day} onClick={() => handlers.handleSelectDay(day)}>
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
