import { MenuProps } from 'antd';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type MenuItem = Required<MenuProps>['items'][number];
