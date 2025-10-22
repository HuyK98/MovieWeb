import { format } from 'date-fns';

export const formatTimestamp = (timestamp) => {
  try {
    return format(new Date(timestamp), 'HH:mm:ss dd/MM/yyyy');
  } catch {
    return 'Invalid date';
  }
};