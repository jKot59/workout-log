import { startTransition, useEffect, useState } from 'react';
import { DayOfWeek, MenuItem } from './types';
import { arraysSymmetricDifference } from '@/shared/lib/helpers/arraysSymmetricDifference';
import { useProgramsStore } from '@/stores/programs-store';

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
  const { db, programs } = useProgramsStore();

  const [availableDays, setAvailableDays] = useState<DayOfWeek[]>(() => [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]);

  function toggleDaysList() {
    startTransition(() => setIsAvailableDaysListShown((prev) => !prev));
  }

  async function handleSelectDay(day: DayOfWeek) {
    setMenuItems((prev) => [...prev, day]);
    setAvailableDays((prev) => prev.filter((item) => item.toLowerCase() !== day.toLowerCase()));
    toggleDaysList();

    await db?.addItem({ name: day.toLowerCase() as DayOfWeek, exercises: [] });
  }

  useEffect(() => {
    if (programs === null) return;

    const loadProducts = () => {
      const takeOnlyDays = programs.map((program) => program.name);
      setMenuItems(takeOnlyDays);
      setAvailableDays((prev) => arraysSymmetricDifference(prev, takeOnlyDays) as DayOfWeek[]);
    };

    loadProducts();
  }, [programs]);

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
