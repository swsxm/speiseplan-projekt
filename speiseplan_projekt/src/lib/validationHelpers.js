/* This file provides functions for validation */

/**
 * Checks the Length
 */
export function validateLength(toCheck, min = MIN_LENGTH, max = MAX_LENGTH) {
    if (toCheck.length < min || toCheck.length > max) {
        return `Must be between ${min} and ${max} characters long.`;
    }
    return null;
}

/**
 * Validates the ID for length and whether it is a positive integer.
 */
export function validateNumber(id, minLength, maxLength) {
    const isId = /^[1-9][0-9]*$/; // Regex for positive integers

    const lengthError = validateLength(id, minLength, maxLength);
    if (lengthError) return `ID ${lengthError}`;

    if (!isId.test(id)) return 'The ID must be a number.';

    return null;
}

/**
 * Validates the Number for length and whether it is a positive decimal.
 */
export function validateFloat(value, minLength, maxLength) {
    console.log(value)
    const isFloat = /^\d+(\.\d+)?$/;

    const lengthError = validateLength(value, minLength, maxLength);
    if (lengthError) return `Value ${lengthError}`;

    if (!isFloat.test(value)) return 'The value must be a positive floating-point number.';

    return null;
}
/**
 * Validates the email for length and format.
 */
export function validateEmail(email) {
    const min = 5;
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex for valid email addresses

    const lengthError = checkLength(email, min, MAX_LENGTH);
    if (lengthError) return `Email ${lengthError}`;

    if (!isEmail.test(email)) return 'The email address is invalid.';

    return null;
}

/** 
 * Validates a correct URL format
 */ 
export function validateUrl(url) {
    try {
        new URL(url);
        return null; 
    } catch (e) {
        return 'URL is not valid: ' + url;
    }
}

/**
 * Error Popup with the error message if the status is not 2**
 */
export function showError(response) {
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
