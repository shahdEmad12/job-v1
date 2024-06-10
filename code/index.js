import express from "express"
import dbConnection from "./DB/connection.js"
import { config } from "dotenv"
import userRouter from './src/modules/user/user.route.js'
import companyRouter from './src/modules/company/company.routes.js'
import jobRouter from './src/modules/job/job.routes.js'
import { asyncHandler } from "./src/middleware/globalResponse.js"


config({path:'./config/dev.config.env'})
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use('/user', userRouter)
app.use('/company', companyRouter)
app.use('/job', jobRouter)

app.use(asyncHandler)
dbConnection()

app.listen(port, ()=>{console.log(`server running on ${port}`)})