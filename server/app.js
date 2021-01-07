const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

const mongoose = require('mongoose')

const { User, Event } = require('./models/index.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS

app.use(cors());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

//EJS
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine','ejs');

const PORT = process.env.PORT || 8000

const mongoKeys = require('./config/keys.js')

mongoose.connect(`mongodb+srv://${mongoKeys.username}:${mongoKeys.password}@cluster0.bt4sv.mongodb.net/eventTracker?retryWrites=true&w=majority&ssl=true`, 
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err))
    
//Return all events
app.get('/event', (req, res) => {
    Event.find({})
    .then(eventsList => {
        var events = []
        eventsList.forEach(event => {
            var date = new Date(event.deadline.substring(0,4), event.deadline.substring(5,7),event.deadline.substring(8,10))
            var current = new Date()
            if (date > current) events.push(event)
        })
        res.send(events)
    })
    .catch(err => res.status(400).send('Error'))
})

//List events specific to the user
app.get('/event/:user/:rollno', async(req, res) => {
    Event.find({})
    .then(eventsList => {
        var events = []
        User.findOne({ name: req.params.user, rollno: req.params.rollno })
        .then(user => {
            events = eventsList.filter((event) => {
            var date = new Date(event.deadline.substring(0,4), event.deadline.substring(5,7),event.deadline.substring(8,10))
            var current = new Date()
            return date > current &&
                (event.isPublic || user.privateEvents.includes(event.id)) &&
                !user.closedNotif.includes(event.id)
            })
            res.render('events.ejs', { events, name: user.name, rollno: user.rollno })                
        })
        .catch(err => res.status(400).send('Error'))
    })
    .catch(err => res.status(400).send('Error'))
})

//Mark read route
app.delete('/event/:user/:rollno/delete/:notifid', (req, res) => {
    User.findOneAndUpdate({ name: req.body.name, rollno: req.body.rollno }, { $push: { closedNotif: req.params.notifid } }, (error) => {
        if (error) {
            console.log(error);
            res.send('error' + error)
        } else {
            Event.find({})
            .then(eventsList => {
                var events = []
                User.findOne({ name: req.body.user, rollno: req.body.rollno })
                .then(user => {
                    events = eventsList.filter((event) => {
                        var date = new Date(event.deadline.substring(0,4), event.deadline.substring(5,7),event.deadline.substring(8,10))
                        var current = new Date()
                        return date > current &&
                            (event.isPublic || user.privateEvents.includes(event.id)) &&
                            !user.closedNotif.includes(event.id)
                    })
                    res.redirect(`/event/${req.params.user}/${req.params.rollno}`)                  
                })
                .catch(err => res.status(400).send('Error'))
            })
            .catch(err => res.status(400).send('Error'))
        }
    })
})

app.get('/event/:eventId', (req, res) => {
    Event.findById(req.params.eventId)
        .then(event => {
            if (event) res.send(event)
            else res.send('Event does not exist')
        })
        .catch(err => res.status(400).send('Error'))
})

//Create a event
app.post('/event', async(req, res) => {
    User.findOne({ name: req.body.user, rollno: req.body.rollno })
    .then(user => {
        const event = new Event({
            name: req.body.name,
            isPublic: req.body.isPublic,
            description: req.body.content,
            deadline: req.body.date,
            url: req.body.url,
            createdBy: user._id,
        })
        event.save()
        .then(event => {
            if (!event.isPublic) {
                User.findByIdAndUpdate(user._id, { $push: { privateEvents: event._id } })
                .then(() => res.send('saved'))
                .catch(err => res.status(400).send('Error'))
            }
        })
        .catch(err => res.status(400).send('Error'))
    })
    .catch(err => res.status(400).send('Error'))
})

//Create a user
app.post('/add/user', async(req, res) => {
    User.findOne({ rollno: req.body.rollno })
    .then(user => {
        if (user) {
            console.log("User already exists")
            res.send("User already exists")
        } else {
            const user_name = new User({
                name: req.body.name,
                rollno: req.body.rollno
            })
            user_name.save()
            .then(() => res.send('User created successfully'))
            .catch(err => res.status(400).send('Error'))
        }
    })
    .catch(err => res.status(400).send('Error'))
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))