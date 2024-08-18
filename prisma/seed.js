import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
	await prisma.log.deleteMany({})
	await prisma.picture.deleteMany({})
	await prisma.visit.deleteMany({})
	await prisma.location.deleteMany({})
	await prisma.user.deleteMany({})
	const hashedPassword = await bcrypt.hash('123qwe', 8)
	for (let i = 1; i <= 7; i++) {
		const user = await prisma.user.create({
			data: {
				username: `user${i}`,
				password: hashedPassword,
			},
		})
		console.log('User created:', user)

		const location = await prisma.location.create({
			data: {
				name: `A nice location ${i}`,
			},
		})
		console.log('Location created:', location)

		const visit = await prisma.visit.create({
			data: {
				userId: user.id,
				locationId: location.id,
			},
		})
		console.log('Visit created:', visit)

		await prisma.picture.createMany({
			data: [
				{
					url: `http://example.com/A_nice_location-1.jpg ${i}`,
					userId: user.id,
					locationId: location.id,
					visitId: visit.id,
				},
				{
					url: `http://example.com/A_nice_location-2.jpg ${i}`,
					userId: user.id,
					locationId: location.id,
					visitId: visit.id,
				},
			],
		})
		console.log('Pictures created for visit:', visit)

		await prisma.log.create({
			data: {
				visitId: visit.id,
				locationId: location.id,
				userId: user.id,
				logEntries: [`Visited a nice location ${i}`],
			},
		})
		console.log('Log created for visit:', visit)
	}
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})