import { getWeek } from 'date-fns';


export const calenderWeek = (date) => {
    return getWeek(new Date(date), { weekStartsOn: 1 });
}

export const dayOfWeek = (date) => {
    return new Date(date).getDay();
}
