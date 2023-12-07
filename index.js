import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import User from './models/User.js'
import connectDB from './config/db.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app = express()


dotenv.config()

connectDB()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
  })


app.post('/api/users', async (req, res) => {
    try {
        const {username} = req.body;
        const newUser = new User({username})

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch(error) {
        res.status(500).json({error: error.message })
    }
})

app.get('/api/users', async (req, res) => {
    try {

        const listUsers = await User.find({})
        if(!listUsers) {
            res.status(404).json({error: 'No users found'})
        }
        res.status(201).json(listUsers)
    } catch(error) {
        res.status(500).json({error: error.message })
    }
})


app.post('/api/users/:id/exercises', async(req, res) => {
    const {id, description, duration, date} = req.body
    const userId = req.params.id
    try {
        const updatedUser = await User.findOneAndUpdate(
            { id },
            { $push: { log: { description, duration, date } } },
            { new: true }
          );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }

        res.status(201).json({updatedUser})
    } catch(error) {
        res.status(500).json({error: error.message })
    }
})

app.get('/api/users/:id/logs', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user) {
            res.status(404).json({error: 'User not found'})
        }
    } catch(error) {
        res.status(500).json({error: error.message })
    }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})