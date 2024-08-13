import prisma from "../utils/dbClient";

const createPlaceDb = async (user, place, picture, log_entry) => {
    const newPlace = await prisma.places.create
}