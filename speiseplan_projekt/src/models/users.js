// MONGO DB USERS SCHEME

import mongoose, {Schema} from "mongoose";

const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {    
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    employee_id: {
        type: Number,
        required: true,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
},
{
    timestamps: true
});

const Users = mongoose.models.Users || mongoose.model("Users", usersSchema);
export default Users;