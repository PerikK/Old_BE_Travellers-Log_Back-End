import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient

async function seed() {
    const createdUser = await prisma.user.create({
			data: {
				username: 'tester1',
				password: '123qwe',
			},
		})
    console.log('Created:',createdUser );
}
seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})