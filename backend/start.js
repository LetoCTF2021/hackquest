// server.js
const express = require('express');
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const linkDb = { url: 'mongodb://localhost:27017/' }
const app = express()
const port = 8081
const cors = require('cors')
const bearerToken = require('express-bearer-token')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bearerToken())

MongoClient.connect(linkDb.url, (err, client) => {
   const db = client.db("hackquest")
  if (err) return console.log(err)
    require('./app/routes')(app, db)
    
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})