const mongoose = require('mongoose')

const wrongParameters = () => {
  console.log('first argument must be password')
  console.log('write only password to get all numbers')
  console.log('give name and number separated with space to add new')
  process.exit(1)
}

if (process.argv.length<3) {
  wrongParameters()
}
const password = process.argv[2]

const url =
  `mongodb+srv://desipeli:${password}@cluster0.drnwigu.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
console.log(process.argv.length)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
} else {
  mongoose.connection.close()
  wrongParameters()
}