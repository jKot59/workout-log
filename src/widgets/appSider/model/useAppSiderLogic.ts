import { startTransition, useLayoutEffect, useState } from 'react';
import { DayOfWeek } from './types';
import { arraysSymmetricDifference } from '@/shared/lib/helpers/arraysSymmetricDifference';
import { useProgramsStore } from '@/stores/programs-store';

export function useAppSiderLogic() {
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState<DayOfWeek[]>(() => []);
  const [isAvailableDaysListShown, setIsAvailableDaysListShown] = useState(false);
  const { db, programs, isLoading: isMenuItemsLoading } = useProgramsStore();

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

  useLayoutEffect(() => {
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
      isMenuItemsLoading,
      isAvailableDaysListShown,
    },
    handlers: {
      setCollapsed,
      toggleDaysList,
      handleSelectDay,
    },
  };
}

export type TuseAppSiderLogic = ReturnType<typeof useAppSiderLogic>;
