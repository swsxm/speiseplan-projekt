import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Users from "@/models/users";
import bcrypt from "bcryptjs";
import { validateLength, validateNumber, validateEmail } from "../../../lib/validationHelpers";

// Constants for minimum and maximum lengths
const MIN_LENGTH = 1;
const MAX_LENGTH = 255;


function validatePassword(password) {
/**
 * Validates the password for length, numbers, uppercase letters, lowercase letters, and special characters.
 */
    const min = 8;
    const max = 30;
    const hasNumber = /\d/; 
    const hasUpperCase = /[A-Z]/;  
    const hasLowerCase = /[a-z]/; 
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; 

    const lengthError = validateLength(password, min, max);
    if (lengthError) return `Password ${lengthError}`;

    if (!hasNumber.test(password)) return 'Password must contain at least one number.';
    if (!hasUpperCase.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!hasLowerCase.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!hasSpecialChar.test(password)) return 'Password must contain at least one special character.';

    return null;
}


function validateName(name) {
/**
 * Validates the name for length and whether it is alphanumeric with optional last name.
 */
    const isName = /^[A-Za-zÄÖÜäöüß]+(?: [A-Za-zÄÖÜäöüß]+)*$/; // Regex for names with optional last name

    const lengthError = validateLength(name, MIN_LENGTH, MAX_LENGTH);
    if (lengthError) return `Name ${lengthError}`;

    if (!isName.test(name)) return 'The name must be alphanumeric and may include up to a first and last name.';

    return null;
}


async function handleValidationErrors(name, email, id, password) {
/**
 * Checks all registration values and returns the first found error.
 */
    const errors = {
        password: validatePassword(password),
        email: validateEmail(email),
        name: validateName(name),
        id: validateNumber(id, 1, 8),
    };

    for (const [field, error] of Object.entries(errors)) {
        if (error) return { status: 400, error: error };
    }
    return null;
}


export async function POST(req) {
/**  
 * Processes the POST request for registration.
 * Validates inputs, creates the user, and saves them to the database.
 */
    try {
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
