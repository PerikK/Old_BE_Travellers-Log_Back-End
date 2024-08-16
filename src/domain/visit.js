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
			location: {
				select: { name: true },
			},
			logs: true,
			pictures: true,
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
			logs: true,
			pictures: true,
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

const getVisitByIdDb = async (id) => {
	const foundVisit = await prisma.visit.findFirst({
		where: {
			id: id,
		},
	})
	return foundVisit
}

const updateVisitByIdDb = async (id, logEntry, pictureUrl) => {
	const visitToUpdate = await prisma.visit.findUnique({
		where: { id: id },
		select: {
			userId: true,
			locationId: true,
			location: true,
			createdAt: true,
			updatedAt: true,
		},
	})

	const updateData = {}

	if (logEntry) {
		const log = await prisma.log.findFirst({
			where: {
				visitId: id,
			},
			select: {
				id: true,
				logEntries: true,
			},
		})

		let logUpdateData
		if (log) {
			logUpdateData = {
				update: {
					where: { id: log.id },
					data: {
						logEntries: {
							set: [...log.logEntries, logEntry],
						},
					},
				},
			}
		} else {
			logUpdateData = {
				create: {
					visitId: id,
					logEntries: [logEntry],
					userId: visitToUpdate.userId,
					locationId: visitToUpdate.locationId,
				},
			}
		}
		updateData.logs = logUpdateData
	}

	if (pictureUrl) {
		updateData.pictures = {
			create: {
				url: pictureUrl,
				userId: visitToUpdate.userId,
				locationId: visitToUpdate.locationId,
			},
		}
	}

	const updatedVisit = await prisma.visit.update({
		where: {
			id: id,
		},
		data: updateData,
		include: {
			logs: true,
			pictures: true
		}
	})
	return updatedVisit 
}

export {
	createVisitDb,
	getVisitsByUserDb,
	existingVisitDb,
	getVisitByIdDb,
	updateVisitByIdDb,
}
