const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const request = require('request')

const { User, Event } = require('./models/index.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var token = 'yrv0sigsq4oa5g3v';
var instanceId = '214303/' //This will work only for 3 days
var url = `https://api.chat-api.com/instance${instanceId}/message?token=${token}`;

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
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 8000

const mongoKeys = require('./config/keys.js')

mongoose.connect(mongoKeys.fullString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err))

//Return all events
app.get('/event', (req, res) => {
    Event.find({})
        .then(eventsList => {
            var events = []
            eventsList.forEach(event => {
                var date = new Date(event.deadline.substring(0, 4), event.deadline.substring(5, 7), event.deadline.substring(8, 10))
                var current = new Date()
                if (date > current) events.push(event)
            })
            res.send(events)
        })
        .catch(err => res.status(400).send('Error'))
})

//List events specific to the user
app.get('/events/:user/:rollno', async(req, res) => {
    Event.find({})

    .then(eventsList => {
            var events = []
            User.findOne({ name: req.params.user, rollno: req.params.rollno })
                .then(user => {
                    events = eventsList.filter((event) => {
                        if (event.deadline) {
                            var date = new Date(event.deadline.substring(0, 4), event.deadline.substring(5, 7), event.deadline.substring(8, 10))
                            var current = new Date()
                            return date > current &&
                                (event.isPublic || user.privateEvents.includes(event.id)) &&
                                !user.closedNotif.includes(event.id)
                        } else {
                            return (event.isPublic || user.privateEvents.includes(event.id)) &&
                                !user.closedNotif.includes(event.id)
                        }
                    })
                    res.render('events.ejs', { events, name: user.name, rollno: user.rollno })
                })
                .catch(err => res.status(400).send('Error'))
        })
        .catch(err => res.status(400).send('Error'))
})

//fetch events length for notification
app.get('/fetchevents/:user/:rollno', async(req, res) => {
    Event.find({})
        .then(async eventsList => {
            var events = []
            const user = await User.findOne({ name: req.params.user, rollno: req.params.rollno })
            events = eventsList.filter((event) => {
                if (event.deadline) {
                    var date = new Date(event.deadline.substring(0, 4), event.deadline.substring(5, 7), event.deadline.substring(8, 10))
                    var current = new Date()
                    return date > current &&
                        (event.isPublic || user.privateEvents.includes(event.id)) &&
                        !user.closedNotif.includes(event.id)
                } else {
                    return (event.isPublic || user.privateEvents.includes(event.id)) &&
                        !user.closedNotif.includes(event.id)
                }
            })
            res.status(200).send(`${events.length}`)
        })
        .catch(err => res.status(400).send('Error'))
})

//Mark read route
app.get('/event/:user/:rollno/delete/:notifid', (req, res) => {
    User.findOneAndUpdate({ name: req.params.user, rollno: req.params.rollno }, { $push: { closedNotif: req.params.notifid } }, (error) => {
        if (error) {
            console.log(error);
            res.send('error' + error)
        } else {
            res.redirect(`/events/${req.params.user}/${req.params.rollno}`)
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
    const user = await User.findOne({ name: req.body.user, rollno: req.body.rollno })
    var event = new Event({
        name: req.body.name,
        isPublic: req.body.isPublic,
        description: req.body.content,
        deadline: req.body.date,
        url: req.body.url,
        createdBy: user._id,
    })
    const saved_event = await event.save()
    if (!saved_event.isPublic) {
        await User.findOneAndUpdate({ name: req.body.user }, { $push: { privateEvents: saved_event._id } })
        var data = {
            phone: mongoKeys.phone,
            body: "*" + saved_event.name + "* \n\n" + saved_event.url + " \n\n" + saved_event.description,
        };
        request({
            url: url,
            method: "POST",
            json: data
        },(err,res,body)=>{
            if(err)
            console.error(err)           
            else console.log(body)
        })
    }
    res.send('sent')
})

//Create a user
app.post('/add/user', async(req, res) => {
    await User.findOne({ rollno: req.body.rollno }, async(error, user) => {
            if (user) {
                console.log("User already exists")
                res.send("User already exists")
            } else {
                const user_name = new User({
                    name: req.body.name,
                    rollno: req.body.rollno
                })
                await user_name.save()
                    .then(() => res.send('User created successfully'))
                    .catch(err => res.status(400).send('Error'))
            }
        })
        .catch(err => res.status(400).send('Error'))
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
