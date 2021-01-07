const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

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

const PORT = process.env.PORT || 8000

const mongoKeys = require('./config/keys.js')

mongoose.connect(`mongodb+srv://${mongoKeys.username}:${mongoKeys.password}@cluster0.bt4sv.mongodb.net/eventTracker?retryWrites=true&w=majority&ssl=true`, { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connection to MongoDB successful')
)

app.get('/event', (req, res) => {
    console.log(req.body);
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
            if (event) res.send(event)
            else res.send('Event does not exist')
        })
        .catch(err => res.status(400).send('Error'))
})

app.post('/event', async(req, res) => {
    console.log(req.body)
    const user = await User.findOne({ name: req.body.user })
    var event = new Event({
        name: req.body.name,
        isPublic: req.body.isPublic,
        description: req.body.content,
        deadline: req.body.date,
        url: req.body.url,
        createdBy: 1,
    })
    await event.save()
    res.send('sent')
})

app.post('/add/user', async(req, res) => {
    console.log(req.body)
    await User.findOne({ rollno: req.body.rollno }, async(error, user) => {
        if (user) {
            console.log("User already exists")
            res.send("User already exists")
        }
        if (!user) {
            const user_name = new User({
                name: req.body.name,
                rollno: req.body.rollno
            })
            await user_name.save()
            res.send('User created successfully')
        }
    })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))