import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import userRouter from './routers/user.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users',userRouter)


export default app
