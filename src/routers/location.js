import { Router } from 'express'
import { createLocation, getLocationByUser } from '../controllers/location.js'

const locationRouter = Router()

locationRouter.post('/', createLocation)
locationRouter.get('/:userId', getLocationByUser)


export default locationRouter
