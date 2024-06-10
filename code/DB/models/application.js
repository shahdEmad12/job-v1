import mongoose, { Schema, model } from "mongoose";


const appSchema = new Schema({
    jobId:{
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'USER',
        required: true
    },
    userTechSkills: {
        type: [String],
        required: true,
    },
    userSoftSkills: {
        type: [String],
        required: true,
    },
    userResume: {
        type: {
            url: String,
            public_id: String
        },
        required: true
    
    },

},{
    timestamps: true
})

const App = model('App', appSchema)

export default App