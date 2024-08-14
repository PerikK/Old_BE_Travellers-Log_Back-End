import prisma from "../utils/dbClient.js";

const createLocationDb = async (user, name, picture, log_entry) => {
    const newLocation = await prisma.location.create({
        data: {
            name: name,            
            userVisits: {
                create: {
                    user: {
                        connect: {
                            id: user
                        }
                    }
                }
            },
            ...(picture && {
                create: {
                    url: picture
                }
            }),
            ...(log_entry && {
                create: {
                    logEntries: log_entry
                }
            })
        }
    })
    return newLocation
}

const getLocationByUserDb = async (id) => {

    console.log('getLocationByUserDb function is called')
    console.log('domain',id);
    const userLocations = await prisma.location.findMany({
        where: {
            userVisits: {
            some: {
                    userId: id
                }
            }
        }
    })
    return userLocations
}

const getAllLocationsDb = async () => {
    const allLocations = await prisma.location.findMany()
    return allLocations
}

export { createLocationDb, getAllLocationsDb, getLocationByUserDb }