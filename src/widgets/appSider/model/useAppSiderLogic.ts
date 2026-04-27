import { startTransition, useEffect, useState } from 'react';
import { DayOfWeek, MenuItem } from './types';
import { arraysSymmetricDifference } from '@/shared/lib/helpers/arraysSymmetricDifference';
import { IndexedDBManager } from '@/shared/lib/indexedDB/IndexedDBManager';

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

  const db = new IndexedDBManager('WorkoutLogDatabase', 1, 'exercises');

  function toggleDaysList() {
    startTransition(() => setIsAvailableDaysListShown((prev) => !prev));
  }

  async function handleSelectDay(day: DayOfWeek) {
    setMenuItems((prev) => [...prev, day]);
    setAvailableDays((prev) => prev.filter((item) => item !== day));
    toggleDaysList();

    await db.openDB();
    await db.addItem({ name: day.toLowerCase(), exercises: [] });
  }

  useEffect(() => {
    const loadProducts = async () => {
      await db.openDB();
      const programs = await db.getAllItems();

      const takeOnlyDays = programs.map((program) => program.name);

      setMenuItems(takeOnlyDays);

      setAvailableDays((prev) => arraysSymmetricDifference(prev, takeOnlyDays) as DayOfWeek[]);
    };
    loadProducts();
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
