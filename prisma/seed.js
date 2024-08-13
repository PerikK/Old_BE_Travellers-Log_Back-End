import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
	await prisma.log.deleteMany({})
	await prisma.picture.deleteMany({})
	await prisma.visit.deleteMany({})
	await prisma.location.deleteMany({})
	await prisma.user.deleteMany({})

	for (let i = 1; i <= 7; i++) {
		const user = await prisma.user.create({
			data: {
				username: `user${i}`,
				password: 'securepassword',
			},
		})
		console.log('User created:', user)

		const location = await prisma.location.create({
			data: {
				name: `A nice location ${i}`,
				userVisits: {
					create: {
						user: {
							connect: { id: user.id },
						},
					},
				},
				log: {
					create: [
						{
							userId: user.id,
							logEntries: [`Visited a nice location ${i}`],
						},
					],
				},
				pictures: {
					create: [
						{
							url: `http://example.com/A_nice_location-1.jpg ${i}`,
						},
						{
							url: `http://example.com/A_nice_location-2.jpg ${i}`,
						},
					],
				},
			},
		})
		console.log('location created:', location)
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
