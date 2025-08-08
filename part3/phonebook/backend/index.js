const express = require('express')
const morgan = require('morgan')
require('dotenv').config()

const app = express()

app.use(express.static('dist'))
app.use(express.json())

const Person = require('./models/persons')


morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) :''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const getDateInfo = () => {
  const currentDate = new Date()
  const date = currentDate.toLocaleDateString('en-US', { weekday:'long' })
  const month = currentDate.toLocaleDateString('en-US', { month:'long' })
  const day = currentDate.getDate()
  const year = currentDate.getFullYear()

  const timeOption = {
    hour : '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }

  const timeWithTimeZone = currentDate.toLocaleDateString('en-US', timeOption)

  return `${day} ${month} ${date} ${year} ${timeWithTimeZone}`
}

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error:'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello, welcome to phonebook</h1>')
})

app.get('/api/persons', (request, response, next) => {

  Person.find({})
    .then(result => {
      response.json(result)

    }).catch(error => next(error) )
} )

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(result => {
    if(result){
      response.json(result)
    }else{
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id',(request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(
      () => {
        response.status(204).end()
      }
    )
    .catch(error => next(error))


})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(results => {
      response.json(results)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info',(request, response, ) => {

  response.send(`<p>The phonebook has info for ${Person.length} person's</p>
        <p>${getDateInfo()}</p>`)

})

app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)
const port = process.env.PORT

app.listen(port)
console.log('server running at port', port)