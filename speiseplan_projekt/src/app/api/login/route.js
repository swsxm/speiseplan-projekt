import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import Users from "@/models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { error } from 'console';

export async function POST(req) {  
    try {
        const reqBody = await req.json();
        const { id, password } = reqBody;
        await connectMongoDB();
        const user = await Users.findOne({ employee_id: id });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid Credentials" },
                { status: 400 }
            );
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid Credentials" },
                { status: 400 }
            );
        }

        const tokenData = {
            id: user.employee_id,
            name: user.name,
            email: user.email,
            admin: user.admin
        };

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

        const response = NextResponse.json(
            { message: "Login successful" },
            { status: 201 }
        );
        response.cookies.set("token", token, {httpOnly: true});
        response.cookies.set("name", user.name)
        response.cookies.set("employeeID", user.employee_id)
        console.log(user.name);

        
        return response;
    } catch (e) {
        return NextResponse.json(
            { error: e.message },
            { status: 500 }
        );
    }
}
