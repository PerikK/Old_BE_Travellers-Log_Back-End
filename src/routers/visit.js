import { Router } from 'express'
import { createVisit } from '../controllers/visit.js'

const visitRouter = Router()

visitRouter.post('/', createVisit)

export default visitRouter
