import mongoose, { Schema, model } from "mongoose";


const companySchema = new Schema({
    companyName:
        {
        type: String,
        unique: true,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    industry:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    numberOfEmployees:{
        type: Number,
        required: true,
        min: 20,
        max: 100,
    },
    companyEmail:{
        type: String,
        unique: true,
        required: true
    },
    companyHR:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
},
{
    timestamps: true
})

const Company = model('Company', companySchema)

export default Company