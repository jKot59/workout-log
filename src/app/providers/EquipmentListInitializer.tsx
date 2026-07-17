'use client';
import { useEquipmentStore } from '@/stores/equipment-store';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export function EquipmentListInitializer() {
  const { putEquipmentList } = useEquipmentStore();

  const { data } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}api/equipment`).then((res) => res.json()),
    retry: false,
  });

  useEffect(() => {
    if (!data) return;

    putEquipmentList(data);
  }, [data]);
  return null;
}
