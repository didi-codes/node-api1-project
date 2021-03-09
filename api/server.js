const express = require('express');
const User = require('./users/model');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(400).json({
          message: `User with ${id} does not exist`,
        });
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

server.post('/api/users', (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res.status(400).json({
      message: 'Please provide name and bio for the user',
    });
  } else {
    User.insert(newUser)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
  }
});

server.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  const data = await User.update(id, changes);
  try {
    if (!id && changes) {
      res.status(404).json({
        message: `The user ${id} and ${changes.name} are not in the database`,
      });
    } else {
      res.status(201).json(data);
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

server.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.remove(id);
    if (!deleted) {
      res.status(404).json({
        message: 'The user does not exist in database',
      });
    } else {
      res.status(deleted);
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

server.use('*', (req, res) => {
  res.status(200).json({
    message: 'Welcome To The Users Database',
  });
});

module.exports = server;
