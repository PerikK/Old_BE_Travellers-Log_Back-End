import { Router } from "express";
import { createUser, getUserById } from "../controllers/user.js";

const userRouter = Router()

userRouter.get('/:id', getUserById)
userRouter.post('/', createUser)

export default userRouter