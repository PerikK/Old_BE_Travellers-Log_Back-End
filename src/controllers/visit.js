import { createVisitDb, getVisitsByUserDb } from '../domain/visit.js'
import { getUserByUsernameDb, getUserByIdDb } from '../domain/user.js'
import 
import {
	MissingFieldsError,
	DataNotFoundError,
	ExistingDataError,
} from '../errors/errors.js'

const createVisit = async (
	userId,
	locationId,
	logEntry,
	pictureUrl
) => {
	const { userId, locationId, logEntry, pictureUrl } = req.body
	if (!user) {
		throw new DataNotFoundError(
			'There is no user with the specified ID'
		)
	}
}
