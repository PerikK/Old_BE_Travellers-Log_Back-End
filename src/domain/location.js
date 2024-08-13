import prisma from "../utils/dbClient";

const createLocationDb = async (user, location, picture, log_entry) => {
    const newLocation = await prisma.location.create({
        data: {
            create: {
                user: {
                    connect: 
                }
            }
        }
    })
}