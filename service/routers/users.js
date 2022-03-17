import { Router } from 'express'
import { User } from '../models/User.js'

const usersRouter = Router()

function sanitizeUsers(users) {
  const sanitizedUsers = users.map((user) => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    decks: user.decks,
    active: user.active
  }))
  return sanitizedUsers
}

const getUsers = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin' || requestor.role === 'superuser') {
    const users = await User.find({})
    res.status(201).send(sanitizeUsers(users))
  } else {
    res.status(403).send('Forbidden')
  }
}

const getUsersById = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin' || requestor.role === 'superuser' ||
    requestor._id.toString() === req.params.id.toString()) {
    const arr = sanitizeUsers([user])
    res.send(arr[0])
  } else {
    res.status(403).send('Forbidden')
  }
}

const updateUser = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  const result = await User.findByIdAndUpdate(req.params.id, req.body)
  const status = res.send('Success: user updated. ', result)
  if (requestor.role === 'admin' || requestor.role === 'superuser' || requestor._id.toString() === req.params.id.toString()) {
    return status
  } else {
    res.status(403).send('Forbidden')
  }
}

const deleteUser = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  const user = await User.findById(req.params.id)
  const result = await User.findByIdAndDelete(user)
  const status = res.send('Success: user deleted. ', result)
  if (requestor.role === 'admin') {
    return status
  } else if (requestor.role === 'superuser' && requestor._id === user._id) {
    return status
  } else if (requestor.role === 'user' && req.params.id === userId) {
    const result = await User.findByIdAndUpdate(user, { active: false })
    res.send('Success: user update, deactivated. ', result)
  } else {
    res.status(403).send('Forbidden')
  }
}

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUsersById)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)

export default usersRouter
