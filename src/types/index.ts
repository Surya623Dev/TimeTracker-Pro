export interface AttendanceRecord {
  id: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  breaks: BreakRecord[];
  totalHours: number;
  totalBreakTime: number;
  netWorkHours: number;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  notes?: string;
}

export interface BreakRecord {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
}