const express = require('express')
const app = express()
const mongoose = require('mongoose')

const PORT = process.env.PORT || 8000

const mongoKeys = require('./config/keys.js')

mongoose.connect('mongodb+srv://mongoKeys.username:mongoKeys.password@cluster0.bt4sv.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connection to MongoDB successful')
)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))