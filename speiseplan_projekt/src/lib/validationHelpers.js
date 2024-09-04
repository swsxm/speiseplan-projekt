/* This file provides functions for validation */

const MIN_LENGTH = 1
const MAX_LENGTH = 255

export function validateLength(toCheck, min = MIN_LENGTH, max = MAX_LENGTH) {
/**
 * Checks the Length
 */
    if (toCheck.length < min || toCheck.length > max) {
        return `Must be between ${min} and ${max} characters long.`;
    }
    return null;
}


export function validateNumber(id, minLength, maxLength) {
/**
 * Validates the ID for length and whether it is a positive integer.
 */
    const isId = /^[1-9][0-9]*$/; // Regex for positive integers

    const lengthError = validateLength(id, minLength, maxLength);
    if (lengthError) return `ID ${lengthError}`;

    if (!isId.test(id)) return 'The ID must be a number.';

    return null;
}


export function validateFloat(value, minLength, maxLength) {
/**
 * Validates the Number for length and whether it is a positive decimal.
 */
    console.log(value)
    const isFloat = /^\d+(\.\d+)?$/;

    const lengthError = validateLength(value, minLength, maxLength);
    if (lengthError) return `Value ${lengthError}`;

    if (!isFloat.test(value)) return 'The value must be a positive floating-point number.';

    return null;
}

export function validateEmail(email) {
/**
 * Validates the email for length and format.
 */
    const min = 5;
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex for valid email addresses

    const lengthError = validateLength(email, min, MAX_LENGTH);
    if (lengthError) return `Email ${lengthError}`;

    if (!isEmail.test(email)) return 'The email address is invalid.';

    return null;
}

 
export function validateUrl(url) {
    /** 
     * Validates that the URL is either http or https
     */
    try {
        const parsedUrl = new URL(url);

        // Check if the protocol is either 'http:' or 'https:'
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return 'URL must start with http:// or https://';
        }

        return null; 
    } catch (e) {
        return 'URL is not valid: ' + url;
    }
}


export function showError(response) {
/**
 * Error Popup with the error message if the status is not 2**
 */
    if (response.status >= 200 && response.status < 300) {
        return null;
    }
    const popup = document.createElement('div');
    popup.textContent = response.error;
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.left = '20px';
    popup.style.backgroundColor = 'red';
    popup.style.color = 'white';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1000';
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

export function validateDate(date) {
/**
 * Validates the date for changing orders
 */
    const inputDate = new Date(date);
    
    // Check if the input date is in the past
    const now = new Date();
    if (inputDate < now) {
        return false;
    }

    // Check if the input date is after Thursday 6pm of this week
    const thursday = new Date();
    thursday.setDate(thursday.getDate() + (4 - thursday.getDay())); // Get this week's Thursday
    thursday.setHours(18, 0, 0, 0); // Set time to 6pm

    if (inputDate > thursday && inputDate <= getNextSundayMidnight(thursday)) {
        return false;
    }
    // Check if the date is in the current week
    const currentWeekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Get Monday of the current week
    const currentWeekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 7)); // Get Sunday of the current week

    if (inputDate >= currentWeekStart && inputDate <= currentWeekEnd) {
        return false;
    }
    return true;
}

function getNextSundayMidnight(thursday) {
    const sunday = new Date(thursday);
    sunday.setDate(thursday.getDate() + (7 - thursday.getDay())); // Next Sunday
    sunday.setHours(0, 0, 0, 0); // Set time to midnight
    return sunday;
}