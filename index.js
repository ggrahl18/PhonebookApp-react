const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

// app.use(cors())
// app.use(express.json())
app.use(express.static('build'))

app.use(
    morgan(
      ':method :url :status :res[content-length] - :response-time ms :content'
    )
  )

morgan.token('content', request => JSON.stringify(request.body))

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
// }

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' })
//   }
  
//   app.use(requestLogger)

let persons = [
    {
        id: 1,
        name: 'Arto Hellas', 
        number: '5734658386',
        date: "2020-01-10T17:30:31.098Z",

    },
    {
        id: 2,
        name: 'George Lucas', 
        number: '5734660467',
        date: "2020-01-10T18:39:34.091Z",

    },
    {
        id: 3,
        name: 'Ada Lovelace', 
        number: '39-44-5323523',
        date: "2020-01-10T19:20:14.298Z",

    },
    {
        id: 4,
        name: 'Dan Abramov', 
        number: '12-43-234345',
        date: "2020-01-10T19:20:14.298Z",

    },
    {
        id: 5,
        name: 'Mary Poppendieck', 
        number: '39-23-6423122',
        date: "2020-01-10T19:20:14.298Z",

    },
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const generateId = () => {
    const min = Math.ceil(1);
    const max = Math.floor(500);
    const randomNumber = Math.floor(Math.random() * (max - min)) + min
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
    return randomNumber
  
    // Random number option #2
    // const maxId = persons.length > 0
    // ? Math.max(...persons.map(n => n.id))
    // : 0
    // return maxId + Math.floor(Math.random() * Math.floor(10))
}

app.get('/info', (req, res) => {
    const dateObj = new Date()
    let dateToString = dateObj

    res.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${dateToString}</p>
    `)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.number) {
        return response.status(400).json({
            error: 'phone number missing'
        })
    }
    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (persons.find(element => (element.name === body.name))) {
        return response.status(400).json({
            error: 'That name has already been entered'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
        date: new Date(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`sever running on port ${PORT}`)
})
