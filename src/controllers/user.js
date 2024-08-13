import {
	createUserDb,
	getUserByIdDb,
	getAllUsersDb,
} from '../domain/user.js'

const createUser = async (req, res) => {
    const { username, password } = req.body

	if (!password || !username) {
		return res.status(400).json({
			error: 'Missing fields in request body',
		})
    }
    
	try {
        const newUser = await createUserDb(username, password)
		res.status(201).json({ created: newUser })
	} catch (e) {
		console.error(e)
		res.status(400).json({ message: 'unable to create user' })
	}
}

const getUserById = async (req, res) => {
    const id = Number(req.params.id)

	if (!id) {
		return res.status(400).json({
			error: 'Missing fields in request body',
		})
    }
    
    try {
        const foundUser = await getUserByIdDb(id)
        res.status(200).json({user: foundUser})        
    } catch(e) {
        console.error(e)
        res.status(400).json({ message: 'unable to find user' })
    }
}

export { createUser, getUserById }
