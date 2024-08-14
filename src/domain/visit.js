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
			pictures: picture
				? {
						create: {
							url: pictureUrl,
							userId: userId,
							locationId: locationId,
						},
					}
				: undefined,
		},
    })
    return newVisit
}

const getVisitsByUserDb = async (userId) => {
    const userVisits = await prisma.visit.findMany({
        where: {
            userId: userId
        }
    })
    return userVisits
}


export { createVisitDb, getVisitsByUserDb }
