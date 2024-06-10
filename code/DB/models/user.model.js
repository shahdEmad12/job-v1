import { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    recoveryEmail:{
        type: String,
        required: true
    },
    DOB:{
        type: Date,
        required: true
    },
    mobileNumber:{
        type: Number,
        unique: true,
        required: true
    },
    role:{
        type: String,
        enum:[systemRoles.COMPANYHR, systemRoles.USER ],
        default: systemRoles.USER  
    },
    status:{
        type: String,
        enum:['offline','online'],
        default: 'offline'
    },
    passwordResetOTP: {
        type: String,
    }

},{
    timestamps: true
})


const USER = model('USER', userSchema)

export default USER