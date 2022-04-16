const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    {
        id: 1,
        name: "Arturo Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

app.use(cors())

// Entrega la información del contenido
app.get('/info', (request, response) => {
    const personNumber = persons.length
    const today = new Date()

    response.send(`
        <p>Phonebook has info for ${personNumber} people</p>
        <p>${today}</p>
    `)
})

// Entrega todos los registros de la agenda telefonica
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Busca a los contactos por su id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

// Elimina a los contactos por su id
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.use(express.json())

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    const fil = persons.filter(person => person.name === body.name)

    if(fil.length !== 0) {
        return response.status(400).json({ 
            error: 'name already exists' 
        })
    }
    else if(!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name o number missing' 
        })
    }
    else{
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
    
        persons = persons.concat(person)
        
        response.json(person)
    }
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})