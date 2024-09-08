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

export const dayNameToNumber = {
    "Montag": 1,
    "Dienstag": 2,
    "Mittwoch": 3,
    "Donnerstag": 4,
    "Freitag": 5,
    "Samstag": 6,
    "Sonntag": 7
  };
