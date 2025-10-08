import { format } from 'date-fns';
export const formatTs = (ts, f = 'HH:mm:ss dd/MM/yyyy') => {
  try { return format(new Date(ts), f); } catch { return 'Invalid date'; }
};
