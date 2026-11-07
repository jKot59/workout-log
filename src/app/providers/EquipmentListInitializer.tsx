'use client';
import { useEquipmentStore } from '@/stores/equipment-store';
import { useLayoutEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiFetch from '@/lib/apiFetch';
//TODO remove it and call where it's needed
export function EquipmentListInitializer() {
  const { putEquipmentList } = useEquipmentStore();

  const { data } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => apiFetch('api/equipment').then((res) => res.json()),
    retry: false,
  });

  useLayoutEffect(() => {
    if (!data) return;

    putEquipmentList(data);
  }, [data]);
  return null;
}
