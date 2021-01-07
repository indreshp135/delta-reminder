const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
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
        type: String
    },
    description: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: false
    }

})

const User = mongoose.model('User', userSchema)
const Event = mongoose.model('Event', eventSchema)

module.exports = {
    User,
    Event
}