import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Users from "@/models/users";
import bcrypt from "bcryptjs";

const validatePassword = (password) => {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  return (
    password.length >= minLength &&
    hasNumber.test(password) &&
    hasUpperCase.test(password) &&
    hasLowerCase.test(password) &&
    hasSpecialChar.test(password)
  );
};

export async function POST(req) {
    try {
        const { name, email, id, password } = await req.json();

        // Validate Passowrd
        if (!validatePassword(password)) {
            return NextResponse.json({ status: 400});
        }

        const admin = false;
        const hashedPassword = await bcrypt.hash(password, 12);
        
        await connectMongoDB();

        console.log("Connecting was successful")
        const user_exists = await Users.findOne({ employee_id: id }).select("_id");
        console.log(user_exists);
        if (user_exists) {
            return NextResponse.json({status: 404})
        }
        await Users.create({ name: name, email: email, employee_id: id, password: hashedPassword, admin: admin});
        return NextResponse.json({status : 201})
    }
    catch {
        return NextResponse.json({status : 500})
    }
}