import { Router } from 'express'
import { createLocation, getLocationByName, getLocationByUser } from '../controllers/location.js'

const locationRouter = Router()

locationRouter.post('/', createLocation)
locationRouter.get('/:userId(\\d+)', getLocationByUser)
locationRouter.get('/:name', getLocationByName)


export default locationRouter
