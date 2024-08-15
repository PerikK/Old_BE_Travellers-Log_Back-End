import prisma from '../utils/dbClient.js'
import {
	createVisitDb,
	existingVisitDb,
	getVisitsByUserDb,
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

// const usersLocations = await getVisitsByUserDb(userId)
// const locationName = location.name
// console.log('location', location);
// console.log('ULLLLLLLLL',usersLocations);
// console.log('name', locationName);
// const location = await prisma.location.findUnique({
// 	where: { name: name },
// })
// const existingVisit = await prisma.visit.findFirst({
// 	where: {
// 		userId: userId,
// 		locationId: location.id,
// 	},
// })
const createVisit = async (req, res) => {
	const { userId, name, logEntry, pictureUrl } = req.body
	console.log(typeof userId, name, logEntry, pictureUrl)
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

export { createVisit }
