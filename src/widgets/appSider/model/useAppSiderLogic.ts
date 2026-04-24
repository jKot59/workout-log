import { startTransition, useEffect, useState } from 'react';
import { DayOfWeek, MenuItem } from './types';
import { arraysSymmetricDifference } from '@/shared/lib/arraysSymmetricDifference';

function createMenuItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export function useAppSiderLogic() {
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<DayOfWeek[]>(() => []);
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
    setMenuItems((prev) => [...prev, day]);
    setAvailableDays((prev) => prev.filter((item) => item !== day));
    toggleDaysList();

    const programs = getMenuItemsFromLocalStorage();
    programs.push(day);

    localStorage.setItem('programs', JSON.stringify(programs));
  }

  function getMenuItemsFromLocalStorage() {
    const programsStr = localStorage.getItem('programs');
    const programs: DayOfWeek[] = programsStr ? JSON.parse(programsStr) : [];
    return programs;
  }

  useEffect(() => {
    const programs = getMenuItemsFromLocalStorage();

    setMenuItems(programs);
    setAvailableDays((prev) => arraysSymmetricDifference(prev, programs));
  }, []);

  return {
    state: {
      menuItems,
      collapsed,
      availableDays,
      isAvailableDaysListShown,
    },
    handlers: {
      setCollapsed,
      toggleDaysList,
      handleSelectDay,
      createMenuItem,
    },
  };
}
