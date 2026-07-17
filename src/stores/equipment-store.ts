import { create } from 'zustand';

interface IEquipment {
  id: string;
  name: string;
}

export interface IEquipmentStore {
  equipmentList: IEquipment[];
  putEquipmentList: (equipmentList: IEquipment[]) => void;
}

export const useEquipmentStore = create<IEquipmentStore>((set) => ({
  equipmentList: [],
  putEquipmentList: (equipmentList: IEquipment[]) => set(() => ({ equipmentList })),
}));
