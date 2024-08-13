import {
	createUserDb,
	getUserByIdDb,
	getAllUsersDb,
	getUserByUsernameDb,
} from '../domain/user.js'
import {
	MissingFieldsError,
	DataNotFoundError,
	ExistingDataError,
} from '../errors/errors.js'

const createUser = async (req, res) => {
	const { username, password } = req.body

	if (!password || !username) {
		throw new MissingFieldsError(
			'Both username and password must be provided in order to create a new user'
		)
	}
	const existingUser = await getUserByUsernameDb(username)
	if (existingUser) {
		throw new ExistingDataError('This username already exists')
	}

	const newUser = await createUserDb(username, password)
	res.status(201).json({ created: newUser })
}

const getUserById = async (req, res) => {
	const id = Number(req.params.id)

	if (!id) {
		throw new MissingFieldsError(
			'ID must be provided in order to search for a user by ID'
		)
	}

	const foundUser = await getUserByIdDb(id)
	res.status(200).json({ user: foundUser })
}



export { createUser, getUserById }
