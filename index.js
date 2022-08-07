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

app.get(`/api/persons/:id`, (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
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

app.delete('/api/persons/:id', (req, res) => {

  
//   const id = Number(req.params.id)
//   persons = persons.filter(p => p.id !== id)
//   res.status(204).end()
// })

// app.post('/api/persons', (req, res) => {
//   const body = req.body

//   if (!body.name) {
//     return res.status(400).json({
//       error: 'name missing'
//     })
//   }
//   if (persons.find(p => p.name === body.name)) {
//     return res.status(400).json({
//       error: 'person already in database'
//     })
//   }
//   if (!body.number) {
//     return res.status(400).json({
//       error: 'number missing'
//     })
//   }

//   const newPerson = {
//     id: Math.floor(Math.random()*1000000),
//     name: body.name,
//     number: body.number
//   }

//   persons = persons.concat(newPerson)
//   res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})