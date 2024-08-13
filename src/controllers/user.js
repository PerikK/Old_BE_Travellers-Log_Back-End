import {
	createUserDb,
	getUserByIdDb,
	getAllUsersDb,
} from '../domain/user.js'

const createUser = async (req, res) => {
	const { email, password } = req.body

	if (!password || !email) {
		return res.status(400).json({
			error: 'Missing fields in request body',
		})
	}
	try {
		const createdUser = await createUserDb(email, password)
		res.status(201).json({ createdUser })
	} catch (e) {
		console.error(e)
		res.status(400).json({ message: 'unable to create user' })
	}
}

const getUserById = async (req, res) => {
    const id = Number(req.params.id)
    // console.log(id);
    // console.log(typeof id);

	if (!id) {
		return res.status(400).json({
			error: 'Missing fields in request body',
		})
    }
    
    try {
        const foundUser = await getUserByIdDb(id)
        console.log(foundUser)
        res.status(200).json({user: foundUser})        
    } catch(e) {
        console.error(e)
        res.status(400).json({ message: 'unable to find user' })
    }
}

export { createUser, getUserById }
