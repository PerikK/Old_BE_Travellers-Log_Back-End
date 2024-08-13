import prisma from "../utils/dbClient.js";

const createUserDb = async (email, password) => {
    await prisma.user.create({
        data: {
            email: email,
            password: password
        }
    })
}

const getUserByIdDb = async (id) => {
    const foundUser = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    
    return foundUser
}

const getAllUsersDb = async () => {
    const allUsers = await prisma.user.findMany()
    return allUsers
}

export {createUserDb, getUserByIdDb, getAllUsersDb}