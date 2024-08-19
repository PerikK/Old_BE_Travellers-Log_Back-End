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
	const { userId, locationName, logEntries, pictureUrls } = req.body
	console.log('Controller Input', userId, locationName, logEntries, pictureUrls)
	if (!userId || !locationName) {
		throw new MissingFieldsError(
			'User and location name must be provided in order to add a new visit'
		)
	}
	const user = await getUserByIdDb(Number(userId))
	if (!user) {
		throw new DataNotFoundError(
			'There is no user with the specified ID'
		)
	}
	const location = await getLocationByNameDB(locationName)
	console.log('location in contr', location)
	if (location) {
		const existingVisit = await existingVisitDb(user.id, locationName)
		if (existingVisit) {
			throw new ExistingDataError(
				'This location already exists in your Travel Log. Maybe you want to update it?'
			)
		}
	}
		const newLocation = await createLocationDb(
			userId,
			locationName
		)

	
	const newVisit = await createVisitDb(
		userId,
		locationName,
		logEntries,
		pictureUrls
	)
	res.status(201).json({ visit_created: newVisit })
}

const getVisitsByUser = async (req, res) => {
	const userId = Number(req.params.id)
	const userVisits = await getVisitsByUserDb(userId)
	res.status(200).json({ user_visits: userVisits })
}

const updateVisit = async (req, res) => {
	const id = Number(req.params.id)
	const { logEntry, pictureUrl } = req.body
	const visit = await getVisitByIdDb(id)

	if (!visit) {
		throw new DataNotFoundError('There is no Visit with this ID')
	}
	if (!logEntry && !pictureUrl) {
		throw new MissingFieldsError(
			'You must provide a log entry or a picture or both in order to update your visit'
		)
	}

	const updatedVisit = await updateVisitByIdDb(
		visit.id,
		logEntry,
		pictureUrl
	)
	res.status(200).json({ updated_visit: updatedVisit })
}

export { createVisit, getVisitsByUser, updateVisit }
