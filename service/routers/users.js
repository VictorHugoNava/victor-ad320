import { Router } from 'express'
import { User } from '../models/User.js'

const usersRouter = Router()

const getUsers = async (req, res) => {
  const users = await User.find({})
  res.send(users)
}

const getUsersById = async (req, res) => {
  const user = await User.findById(req.params.id)
  res.send(user)
}

const updateUser = async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, req.body)
  console.log('result ', result)
  res.sendStatus(503)
}

const deleteUser = async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, { active: false })
  console.log('result ', result)
  res.sendStatus(503)
}

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUsersById)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)

export default usersRouter
