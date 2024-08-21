/* This file provides Helper functions for Date operations */

import { getWeek } from 'date-fns';

/**
 * Calculates the current calender week  
 */
export function calenderWeek(date){
    return getWeek(new Date(date), { weekStartsOn: 1 });
}

/** 
 * Calculates the current day as a number 
 */
export function dayOfWeek(date){
    return new Date(date).getDay();
}
