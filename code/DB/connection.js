import mongoose from "mongoose"

const dbConnection = async() =>{
    await mongoose.connect(process.env.CONNECTION_URL_LOCAL)
    .then((res)=>console.log('db connected successfully'))
    .catch((err)=>console.log('db connection failed', err))
}

export default dbConnection