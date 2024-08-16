import { Router } from 'express'
import { createVisit, getVisitsByUser, updateVisit } from '../controllers/visit.js'

const visitRouter = Router()

visitRouter.post('/', createVisit)
visitRouter.get('/:id', getVisitsByUser)
visitRouter.patch('/:id', updateVisit)

export default visitRouter
