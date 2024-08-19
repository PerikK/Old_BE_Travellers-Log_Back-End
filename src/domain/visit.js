import prisma from '../utils/dbClient.js'


const createVisitDb = async (
	userId,
	locationName,
	logEntries = [],
	pictureUrls = []
) => {
	console.log('createVisitDb called with:', {
		userId,
		locationName,
		logEntries,
		pictureUrls,
	})

	let location = await prisma.location.findUnique({
		where: { name: locationName },
	})

	if (!location) {
		location = await prisma.location.create({
			data: { name: locationName },
		})
	}

	const newVisit = await prisma.visit.create({
		data: {
			userId: userId,
			locationId: location.id,
		},
		include: {
			location: {
				select: { name: true },
			},
			logs: true,
			pictures: true,
		},
	})

	console.log('New visit created:', newVisit)

	if (logEntries.length > 0) {
		const logData = logEntries.map((entry) => ({
			logEntries: [entry],
			userId: userId,
			locationId: location.id,
			visitId: newVisit.id,
		}))

		await prisma.log.createMany({
			data: logData,
		})

		console.log('Log entries created:', logData)
	}

	if (pictureUrls.length > 0) {
		const pictureData = pictureUrls.map((url) => ({
			pictureUrl: [url], // Ensure this is an array
			userId: userId,
			locationId: location.id,
			visitId: newVisit.id,
		}))

		await prisma.picture.createMany({
			data: pictureData,
		})

		console.log('Pictures created:', pictureData)
	}

	const updatedVisit = await prisma.visit.findUnique({
		where: { id: newVisit.id },
		include: {
			location: {
				select: { name: true },
			},
			logs: true,
			pictures: true,
		},
	})

	console.log('Updated visit:', updatedVisit)

	return updatedVisit
}

// const createVisitDb = async (
// 	userId,
// 	locationId,
// 	logEntry,
// 	pictureUrl
// ) => {
// 	const newVisit = await prisma.visit.create({
// 		data: {
// 			userId: userId,
// 			locationId: locationId,
// 			logs: logEntry
// 				? {
// 						create: {
// 							logEntries: [logEntry],
// 							userId: userId,
// 							locationId: locationId,
// 						},
// 					}
// 				: undefined,
// 			pictures: pictureUrl
// 				? {
// 						create: {
// 							pictureUrl: [pictureUrl],
// 							userId: userId,
// 							locationId: locationId,
// 						},
// 					}
// 				: undefined,
// 		},
// 		include: {
// 			location: {
// 				select: { name: true },
// 			},
// 			logs: true,
// 			pictures: true,
// 		},
// 	})
// 	return newVisit
// }



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
	console.log('RUN GET');
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
				pictureUrl: [pictureUrl],
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
