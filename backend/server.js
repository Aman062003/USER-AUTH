const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/userSchema')

const SECRET_KEY = 'secretkey'

// connect to express app
const app = express()


//connect to MOngoDb
const dbURI = 'mongodb+srv://aman062003:kmMY4jMK47ZHPylp@cluster30.jfaro7f.mongodb.net/UsersDB?retryWrites=true&w=majority&appName=Cluster30'

mongoose.connect(dbURI)
 .then(() => {
    app.listen(3001, () => {
        console.log('Server is connected to port 3001 and connected to MongoDB')
    })
 })
 .catch((error) => {
    console.log('Unable to connect');
 })

//middleware
app.use(bodyParser.json())
app.use(cors())



//Routes
//USER REGISTRATION
//POST REGISTER

app.post('/register', async (req, res) => {
   try {
      const { email, username, password } = req.body 
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = new User({ email, username, password: hashedPassword })
      await newUser.save()
      res.status(201).json({ message: 'User created successfully' })
   } catch (error) {
      res.status(500).json({error: 'Error signing up'})
   }
})

//Get registered user
app.get('/register', async (req, res)=>{
   try{
      const users = await User.find()
      res.status(201).json(users)
   } catch (error) {
      res.status(500).json({ error: 'Unable to get users'})
   }
})

//GET LOGIN 
app.post('/login', async(req,res) => {
   try {
      const {username, password} = req.body
      const user = await User.findOne({ username })
      if (!user) {
         return res.status(401).strictContentLength({ error: 'Invalid User Login'})
      }
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
         return res.status(401).json({error: 'Invalid Login'})
      }
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {expiresIn: '1hr'})
      res.json({ message: 'Login Successful'})
   } catch (error) {
      res.status(500).json({ error: 'Error loggin in'})
   }
})








//1hr 4minute




// Create // POST Req.
// Read // GET eq.
// Update // Put or Patch Req.
// Delete // Delete Req.