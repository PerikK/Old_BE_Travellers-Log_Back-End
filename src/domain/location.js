import prisma from '../utils/dbClient.js'

const createLocationDb = async (
	userId,
	name,
	pictureUrl,
	logEntry
) => {
	const location = await getLocationByNameDB(name)
	if (location) {
		return location
	}

	const newLocation = await prisma.location.create({
		data: {
			name: name,
        }, include: {
            pictures: true,
            logs: true
        }
	})

	const newVisit = await prisma.visit.create({
		data: {
			userId: userId,
			locationId: newLocation.id,
			logs: logEntry
				? {
						create: {
							logEntries: [logEntry],
							userId: userId,
							locationId: newLocation.id,
						},
					}
				: undefined,
			pictures: pictureUrl
				? {
						create: {
							url: pictureUrl,
							user: {
								connect: {
									id: userId,
								},
							},
							location: {
								connect: {
									id: newLocation.id,
								},
							},
						},
					}
				: undefined,
		},
	})

	return newLocation
}

const getLocationByUserDb = async (userId) => {
	const userLocations = await prisma.location.findMany({
		where: {
			visits: {
				some: {
					userId: userId,
				},
			},
		},
		include: {
			pictures: true,
			logs: true,
		},
	})
	return userLocations
}

const getLocationByNameDB = async (name) => {
	const foundLocation = await prisma.location.findFirst({
		where: {
			name: name,
		},
		include: {
			visits: {
				include: {
					pictures: true,
					logs: true,
				},
			},
		},
	})
	return foundLocation
}

const getAllLocationsDb = async () => {
	const allLocations = await prisma.location.findMany()
	return allLocations
}

export {
	createLocationDb,
	getAllLocationsDb,
	getLocationByUserDb,
	getLocationByNameDB,
}
