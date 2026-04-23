import { startTransition, useState } from 'react';
import { DayOfWeek, MenuItem } from './types';

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export function useAppSiderLogic() {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(() => []);
  const [isAvailableDaysListShown, setIsAvailableDaysListShown] = useState(false);

  const [availableDays, setAvailableDays] = useState<DayOfWeek[]>(() => [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]);

  function toggleDaysList() {
    startTransition(() => setIsAvailableDaysListShown((prev) => !prev));
  }

  function handleSelectDay(day: DayOfWeek) {
    setItems((prev) => [...prev, getItem(day, day)]);
    setAvailableDays((prev) => prev.filter((item) => item !== day));
    toggleDaysList();
  }

  return {
    state: {
      items,
      collapsed,
      availableDays,
      isAvailableDaysListShown,
    },
    handlers: {
      setCollapsed,
      toggleDaysList,
      handleSelectDay,
    },
  };
}
