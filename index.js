require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// let persons = [
//     { id: 1, name: 'Arto Hellas', number: '040-123456' },
//     { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
//     { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
//     { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
// ]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get(`/api/persons/:id`, (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
}) 

app.get('/info', (req, res) => {
  Person.find({}).then(p => {
    res.send(`
    <div>
    <p>Phonebook has info for ${p.length} people</p>
    <p>${new Date()}</p>
    </div>`)
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {

  Person.findByIdAndRemove({_id: req.params.id})
    .then(person => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  console.log("muutosolio:")
  console.log(`${body.name} ${body.number} ${req.params.id}`)

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

//Oltava viimeisinä
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})