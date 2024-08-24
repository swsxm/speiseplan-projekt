/* This file provides Helper functions for Date operations */

import { getWeek } from 'date-fns';


export function calenderWeek(date){
/**
 * Calculates the current calender week  
 */
    return getWeek(new Date(date), { weekStartsOn: 1 });
}


export function dayOfWeek(date){
/** 
 * Calculates the current day as a number 
 */
    return new Date(date).getDay();
}
