const express = require('express')
const corsConfig = require('../backend/configuration/corsConfig')
const db = require('../backend/configuration/dbConfig.js')
const allowCredentials = require('../backend/middlewares/allowCredentials.js')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const app = express()

dotenv.config();

app.use(allowCredentials)
app.use(cors(corsConfig))
app.use(cookieParser())
app.use(express.json())
db()

app.use('/auth',require('../backend/authentication.js'))

app.listen(process.env.PORT,()=>{
    console.log(`app listening to port ${process.env.PORT}`)
})