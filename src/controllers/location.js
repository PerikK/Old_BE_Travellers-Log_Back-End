import { createLocationDb, getAllLocationsDb, getLocationByUserDb } from "../domain/location.js";
import { getUserByIdDb } from "../domain/user.js";
import {
	MissingFieldsError,
	DataNotFoundError,
	ExistingDataError,
} from '../errors/errors.js'

const createLocation = async (req, res) => {
    const { userId, name, picture, log_entry } = req.body
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
    const newLocation = await createLocationDb(user.id, name, picture, log_entry)
    res.status(201).json({added: newLocation})
}

const getLocationByUser = async (req, res) => {
    const id = Number(req.params.userId)
    if (!id) {
        throw new MissingFieldsError(
            'ID must be provided in order to search for a location visited by the user'
		)
	}
    const user = await getUserByIdDb(id)
    // console.log(user);
    if (!user) {
        throw new DataNotFoundError(
			'There is no user with the specified ID'
		)
    }
    const userLocations = await getLocationByUserDb(id)
    res.status(200).json({ userLocations})
}

export {createLocation, getLocationByUser}