import prisma from "../utils/dbClient.js";

const createUserDb = async (username, password) => {
    const newUser = await prisma.user.create({
        data: {
            username: username,
            password: password
        }
    })
    return newUser
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