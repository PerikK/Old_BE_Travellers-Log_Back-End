import prisma from '../utils/dbClient.js'

const createVisitDb = async (
	userId,
	locationId,
	logEntry,
	pictureUrl
) => {
	const newVisit = await prisma.visit.create({
		data: {
			userId: userId,
			locationId: locationId,
			logs: logEntry
				? {
						create: {
							logEntries: [logEntry],
							userId: userId,
							locationId: locationId,
						},
					}
				: undefined,
			pictures: pictureUrl
				? {
						create: {
							url: pictureUrl,
							userId: userId,
							locationId: locationId,
						},
					}
				: undefined,
		},
		include: {
			logs: true,
			pictures: true,
			location: {
				select: { name: true },
			},
		},
	})
	return newVisit
}

const getVisitsByUserDb = async (userId) => {
	const userVisits = await prisma.visit.findMany({
		where: {
			userId: userId,
		},
		include: {
			location: {
				select: {
					name: true,
				},
			},
		},
	})
	return userVisits
}

const existingVisitDb = async (userId, locationName) => {
	const existingVisit = await prisma.visit.findFirst({
		where: {
			userId: userId,
			location: {
				name: locationName,
			},
		},
	})
	return existingVisit
}

export { createVisitDb, getVisitsByUserDb, existingVisitDb }
