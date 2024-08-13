import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
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
				name: `A nice place ${i}`,
				userVisits: {
					create: {
						user: {
							connect: { id: user.id },
						},
					},
				},
				logs: {
					create: [
						{
							user_id: user.id,
							log_entry: [`Visited a nice place ${i}`],
						},
					],
				},
				pictures: {
					create: [
						{
							url: `http://example.com/A_nice_place-1.jpg ${i}`,
						},
						{
							url: `http://example.com/A_nice_place-2.jpg ${i}`,
						},
					],
				},
			},
		})
		console.log('Place created:', place)
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