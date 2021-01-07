const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    rollno: {
        type: String
    },
    closedNotif: [{
        type: String
    }],
    privateEvents: [{
        type: String
    }]
})

const eventSchema = new mongoose.Schema({
    name: {
        type: String
    },
    deadline: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    description: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    url: {
        type: String
    }

})

const User = mongoose.model('User', userSchema)
const Event = mongoose.model('Event', eventSchema)

module.exports = {
    User,
    Event
}