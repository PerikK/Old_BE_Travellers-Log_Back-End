import {
	createLocationDb,
	getAllLocationsDb,
	getLocationByNameDB,
	getLocationByUserDb,
} from '../domain/location.js'
import { getUserByIdDb } from '../domain/user.js'
import {
	MissingFieldsError,
	DataNotFoundError,
	ExistingDataError,
} from '../errors/errors.js'

const createLocation = async (req, res) => {
	const { userId, name, pictureUrl, logEntry } = req.body
	const user = await getUserByIdDb(Number(userId))
	if (!user) {
		throw new DataNotFoundError(
			'There is no user with the specified ID'
		)
	}
	if (!name) {
		throw new MissingFieldsError(
			'A name must be provided in order to add a new location'
		)
	}
	const newLocation = await createLocationDb(
		user.id,
		name,
		pictureUrl,
		logEntry
	)
	res.status(201).json({ added: newLocation })
}

const getLocationByUser = async (req, res) => {
    const id = Number(req.params.userId)
	if (!id) {
		throw new MissingFieldsError(
			'ID must be provided in order to search for a location visited by the user'
		)
	}
	const user = await getUserByIdDb(id)
	if (!user) {
		throw new DataNotFoundError(
			'There is no user with the specified ID'
		)
	}
	const userLocations = await getLocationByUserDb(id)
	res.status(200).json({ userLocations })
}

const getLocationByName = async (req, res) => {
    const { name } = req.params
    const foundLocation = await getLocationByNameDB(name)
	if (!foundLocation) {
		throw new DataNotFoundError(
			'There is no location with the specified name'
		)
    }
    res.status(200).json({location: foundLocation})    
}

export { createLocation, getLocationByUser, getLocationByName }
