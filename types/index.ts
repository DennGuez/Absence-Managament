export interface Employee {
    id: string,
    firstName: string,
    lastName: string,
    personnelNumber: string
}

export interface Absence {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: AbsenceType;
  reason: string;
}

export interface AbsenceForm {
  startDate: string;
  endDate: string;
  type: AbsenceType;
  reason: string;
}

export interface DateItem {
  date: Date;
  dateString: string;
}

export type AbsenceType = 
  | 'Sick Leave'
  | 'Vacation'
  | 'Personal Leave'
  | 'Medical Appointment'
  | 'Emergency Leave'
  | 'Training'
  | 'Other';

export type DialogMode = 'create' | 'edit';

// Notification types
// types/notification.ts
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type NotificationLocation = 
  | 'top'
  | 'top right'
  | 'top left'
  | 'bottom'
  | 'bottom right'
  | 'bottom left'
  | 'left'
  | 'right'
  | 'center';

export interface NotificationOptions {
  message: string;
  type: NotificationType;
  timeout: number;
  location: NotificationLocation;
  closable: boolean;
  persistent: boolean;
}

export interface NotificationState {
  show: boolean;
  message: string;
  color: string;
  timeout: number;
  location: NotificationLocation;
  closable: boolean;
  persistent: boolean;
}