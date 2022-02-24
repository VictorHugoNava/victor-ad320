import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { Deck } from './models/Deck.js'
import { User } from './models/User.js'

const app = express()
const port = 8000

// Connect to MongoDB
const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.whxiz.mongodb.net/notoriety?retryWrites=true&w=majority`
try {
    await mongoose.connect(connectionString)
} catch (err) {
    console.log('error', err)
}

// Middleware
const exampleMiddleware = (req, res, next) => {
    console.log('example middleware')
    next()
}

app.use(cors())
app.use(express.json())
app.use(exampleMiddleware)

const isUrl = (value) => {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(value)
  }

// Routes

// Hello, World route - starting point 
app.get('/', (req, res) => {
    res.send('Hello, World')
})

// Get an individual card by id
const cardsById = async (req, res) => {
    const card = await Deck.findOne({
        'cards._id': req.params.id
    })
    if (card){
        res.status(200).send(card.cards.slice(0,1))
    } else {
        res.sendStatus(404)
    }
    
}

app.get('/cards/:id', cardsById)

// Get all cards for a deck, with the option to paginate results 
const cardsByDeck = async (req, res) => {
    const limit = req.query.limit
    const deck = await Deck.findById(req.params.id)
    if (deck) {
        res.send(deck.cards.slice(0,5))
    } else {
        res.sendStatus(404)
    }
}

app.get('/decks/:id/cards', cardsByDeck)

//Get a deck by id
const deckById = async (req, res) => {
    const deck = await Deck.findById(req.params.id)
    if (deck) {
        res.status(200).send(deck)
    } else {
        res.sendStatus(404)
    }
}

app.get('/decks/:id', deckById)

// Get a deck by user
const deckByUserId = async (req, res) => {
    const user = await Deck.findOne({'userId': req.params.id})
    if (user) {
        res.send(user)
    } else {
        res.sendStatus(404)
    }
}

app.get('/users/:id', deckByUserId)

// Create a deck
const createDeck = async (req, res) => {
    const deckRequest = new Deck(req.body)
    console.log('request body', deckRequest)
    if (deckRequest.userId) {
        const deck = await Deck.findById(deckRequest.userId)
       if (deck){
           deck.push ({
                name: deckRequest.name,
                cards: deckRequest.cards,
                size: deckRequest.size,
                userId: deckRequest.userId
                
            })
            deck.save()
        } 
        Deck.create(deckRequest)
    } 
    res.sendStatus(503)
}

app.post('/decks', createDeck)

// Create a card
const createCard = async (req, res) => {
    const cardRequest = req.body
    console.log('request body ', cardRequest)
    if (cardRequest.deckId) {
      const deck = await Deck.findById(cardRequest.deckId)
      if (deck) {
        deck.cards.push({
          frontImage: cardRequest.frontImage,
          frontText: cardRequest.frontText,
          backImage: cardRequest.backImage,
          backText: cardRequest.backText
        })
        deck.save()
      }
    }
    res.sendStatus(503)
  }

  app.post('/cards', createCard)

// Create a user
const createUser = async (req, res) => {
    const userData = new User(req.body)
    const user = await User.create(userData)
    if (user) {
      res.send(user)
    } else {
      res.sendStatus(404)
    }
  }

  app.post('/users', createUser)

//Update a card 
const updateCard = async (req, res) => {
    const userId = req.headers.user
    const cardId = req.params.id
    const newCard = req.body
    try {
      const user = await User.findById(userId)
      const card = user.decks.cards.id(cardId)
      card.name = newCard.name
      await user.save()
      res.sendStatus(204)
    } catch (err) {
      res.sendStatus(500)
    }
} 

app.put('/cards/:id', updateCard)

//Update a deck 
const updateDeck = async (req, res) => {
    const userId = req.headers.user
    const deckId = req.params.id
    const newDeck = req.body
    try {
      const user = await User.findById(userId)
      const deck = user.decks.id(deckId)
      deck.name = newDeck.name
      await user.save()
      res.sendStatus(204)
    } catch (err) {
      console.log(`${updateDeck.name}: ${err}`)
      res.sendStatus(500)
    }
}

  app.put('/decks/:id', updateDeck)

//Update a user
const updateUser = async (req, res) => {
    const userId = req.headers.user
    const newUser = req.body
    try {
       const user = await User.findById(userId)
       name = newUser.name
       await user.save()
       res.sendStatus(204) 
    } catch (err) {
        res.sendStatus(500)
    }
}

app.put('/users/:id', updateUser)

//Delete a card - work
const deleteCard = async (req, res) => {
    const card = await Deck.deleteOne({'cards._id' : req.params.id})
    if (card) {
      res.send(card)
    } else {
      res.sendStatus(404)
    }
  }

  app.delete('cards/:id', deleteCard)

//Delete a deck and all associated cards
const deleteDeck = async (req, res) => {
    const userId = req.headers.user
    const deckId = req.params.id
    try {
      const user = await User.findById(userId)
      const removedDeck = user.decks.id(deckId).deleteOne()
      console.log(removedDeck)
      user.save()
      res.sendStatus(204)
    } catch (err) {
      console.log(`${deleteDeck.name}: ${err}`)
      res.sendStatus(500)
    }
  }

app.delete('/decks/:id', deleteDeck)

//Delete a user
const deleteUser = async (req, res) => {
    const userId = req.headers.user
    try {
      const user = await User.findById(userId)
      const removeUser = user.id(user).deleteOne()
      user.save()
      res.sendStatus(204)
    } catch (err) {
        res.sendStatus(500)
    } 
}

app.delete('/users/:id', deleteUser)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})