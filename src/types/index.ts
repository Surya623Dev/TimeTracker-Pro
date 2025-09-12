export interface AttendanceRecord {
  id: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  notes?: string;
}