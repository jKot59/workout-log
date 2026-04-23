import { MenuProps } from 'antd';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type MenuItem = Required<MenuProps>['items'][number];
