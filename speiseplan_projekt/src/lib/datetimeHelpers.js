import { getWeek } from 'date-fns';

/* Calculates the current calender week */
export const calenderWeek = (date) => {
    return getWeek(new Date(date), { weekStartsOn: 1 });
}

/* Calculates the current day as a number */
export const dayOfWeek = (date) => {
    return new Date(date).getDay();
}
