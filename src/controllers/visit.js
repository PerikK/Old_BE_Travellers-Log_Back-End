import {
	createVisitDb,
	existingVisitDb,
	getVisitByIdDb,
	getVisitsByUserDb,
	updateVisitByIdDb,
} from '../domain/visit.js'
import { getUserByUsernameDb, getUserByIdDb } from '../domain/user.js'
import {
	getLocationByNameDB,
	createLocationDb,
} from '../domain/location.js'
import {
	MissingFieldsError,
	DataNotFoundError,
	ExistingDataError,
} from '../errors/errors.js'

const createVisit = async (req, res) => {
    const { userId, name, logEntry, pictureUrl } = req.body
    if (!userId || !name) {
        throw new MissingFieldsError('User and location name must be provided in order to add a new visit')
    }
	const user = await getUserByIdDb(Number(userId))
	if (!user) {
		throw new DataNotFoundError(
			'There is no user with the specified ID'
		)
	}
	const location = await getLocationByNameDB(name)
	if (location) {
		const existingVisit = await existingVisitDb(user.id, name)
		if (existingVisit) {
			throw new ExistingDataError(
				'This location already exists in your Travel Log. Maybe you want to update it?'
			)
		}
	} else {
		const newLocation = await createLocationDb(
			userId,
			name,
			logEntry,
			pictureUrl
		)
		res.status(201).json({ location_created: newLocation })
		return
	}
	const newVisit = await createVisitDb(
		userId,
		location.id,
		logEntry,
		pictureUrl
	)
	res.status(201).json({ visit_created: newVisit })
}

const getVisitsByUser = async (req, res) => {
	const userId = Number(req.params.id)
	const userVisits = await getVisitsByUserDb(userId)
	res.status(200).json({user_visits: userVisits})
}

const updateVisit = async (req, res) => {
	const id = Number(req.params.id)
	const { logEntry, pictureUrl } = req.body
	const visit = await getVisitByIdDb(id)

	if (!visit) {
		throw new DataNotFoundError('There is no Visit with this ID')
	}
	if (!logEntry && !pictureUrl) {
		throw new MissingFieldsError("You must provide a log entry or a picture or both in order to update your visit")
	}

	const updatedVisit = await updateVisitByIdDb(visit.id, logEntry, pictureUrl)
	res.status(200).json({updated_visit: updatedVisit})
}

export { createVisit, getVisitsByUser, updateVisit }
