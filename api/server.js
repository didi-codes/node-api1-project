const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})

server.get('/api/users/:id', async (req, res) => {
    const {id} = req.params
    const data = await User.findById(id)
    .then(user => {
        if(!user) {
            res.status(404).json({
                message: `Dog with ${id} does not exist`
            })
        } else {
            res.status(200).json(data)
        }
    })
    .catch(err => {
        res.status(500).json({
            message: err.message
        })
    })
})

module.exports = server; 