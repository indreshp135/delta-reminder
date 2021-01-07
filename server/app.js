const express = require('express')
const app = express()

const mongoose = require('mongoose')

const { User, Event } = require('./models/index.js')

const PORT = process.env.PORT || 8000

const mongoKeys = require('./config/keys.js')

mongoose.connect(`mongodb+srv://${mongoKeys.username}:${mongoKeys.password}@cluster0.bt4sv.mongodb.net/eventTracker?retryWrites=true&w=majority&ssl=true`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connection to MongoDB successful')
)

app.get('/event', (req, res) => {
    Event.find({})
    .then(eventsList => {
        var events = []
        eventsList.forEach(event => {
            if (parseInt(event.deadline) > Date.now()) events.push(event)
        })
        res.send(events)
    })
    .catch(err => res.status(400).send('Error'))
})

app.get('/event/:eventId', (req, res) => {
    Event.findById(req.params.eventId)
    .then(event => {
        if(event) res.send(event)
        else res.send('Event does not exist')
    })
    .catch(err => res.status(400).send('Error'))
})

app.post('/event', (req, res) => {
    console.log(req)
    res.send('sent')
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))