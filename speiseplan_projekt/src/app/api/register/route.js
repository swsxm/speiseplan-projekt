import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Users from "@/models/users";
import bcrypt from "bcryptjs";

// Constants for minimum and maximum lengths
const MIN_LENGTH = 1;
const MAX_LENGTH = 255;

/**
 * Checks if the length of 'toCheck' is between 'min' and 'max'.
 * Returns an error message if the length is not within the range; otherwise, returns null.
 */
function checkLength(toCheck, min = MIN_LENGTH, max = MAX_LENGTH) {
    if (toCheck.length < min || toCheck.length > max) {
        return `Must be between ${min} and ${max} characters long.`;
    }
    return null;
}

/**
 * Validates the password for length, numbers, uppercase letters, lowercase letters, and special characters.
 */
function validatePassword(password) {
    const min = 8;
    const max = 30;
    const hasNumber = /\d/; // Must contain at least one number
    const hasUpperCase = /[A-Z]/; // Must contain at least one uppercase letter
    const hasLowerCase = /[a-z]/; // Must contain at least one lowercase letter
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // Must contain at least one special character

    const lengthError = checkLength(password, min, max);
    if (lengthError) return `Password ${lengthError}`;

    if (!hasNumber.test(password)) return 'Password must contain at least one number.';
    if (!hasUpperCase.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!hasLowerCase.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!hasSpecialChar.test(password)) return 'Password must contain at least one special character.';

    return null;
}

/**
 * Validates the email for length and format.
 */
function validateEmail(email) {
    const min = 5;
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex for valid email addresses

    const lengthError = checkLength(email, min, MAX_LENGTH);
    if (lengthError) return `Email ${lengthError}`;

    if (!isEmail.test(email)) return 'The email address is invalid.';

    return null;
}

/**
 * Validates the ID for length and whether it is a positive integer.
 */
function validateId(id) {
    const max = 8;
    const isId = /^[1-9][0-9]*$/; // Regex for positive integers

    const lengthError = checkLength(id, MIN_LENGTH, max);
    if (lengthError) return `ID ${lengthError}`;

    if (!isId.test(id)) return 'The ID must be a number.';

    return null;
}

/**
 * Validates the name for length and whether it is alphanumeric with optional last name.
 */
function validateName(name) {
    const isName = /^[A-Za-zÄÖÜäöüß]+(?: [A-Za-zÄÖÜäöüß]+)*$/; // Regex for names with optional last name

    const lengthError = checkLength(name, MIN_LENGTH, MAX_LENGTH);
    if (lengthError) return `Name ${lengthError}`;

    if (!isName.test(name)) return 'The name must be alphanumeric and may include up to a first and last name.';

    return null;
}

/**
 * Checks all registration values and returns the first found error.
 */
async function handleValidationErrors(name, email, id, password) {
    const errors = {
        password: validatePassword(password),
        email: validateEmail(email),
        name: validateName(name),
        id: validateId(id),
    };

    for (const [field, error] of Object.entries(errors)) {
        if (error) return { status: 400, error: error };
    }
    return null;
}

export async function POST(req) {
    try {
        /* 
           Processes the POST request for registration.
           Validates inputs, creates the user, and saves them to the database.
        */
        const { name, email, id, password } = await req.json();
        
        const validationError = await handleValidationErrors(name, email, id, password);
        if (validationError) {
            return NextResponse.json(validationError);
        }

        const admin = false;
        const hashedPassword = await bcrypt.hash(password, 12);

        await connectMongoDB();

        console.log("Connecting was successful");
        const user_exists = await Users.findOne({ employee_id: id }).select("_id");
        console.log(user_exists);
        if (user_exists) {
            return NextResponse.json({ status: 400, error: "A user with this ID already exists." });
        }

        await Users.create({ name, email, employee_id: id, password: hashedPassword, admin });
        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error: "An internal server error occurred." });
    }
}
