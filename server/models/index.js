import mongoose, {model} from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    closedNotif: [{
        type: String
    }]
}) 

const eventSchema = new mongoose.Schema({
    name: {
        type: String
    },
    deadline: {
        type: Date
    },
    createdBy: {
        type: String
    },
    description: {
        type: String
    },
    isPublic: {
        type: Boolean
    }

})

const User = mongoose.model('User', userSchema)
const Event = mongoose.model('Event', eventSchema)

module.exports = {
    User,
    Event
}