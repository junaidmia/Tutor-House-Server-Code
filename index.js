const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const app = express()
const cors = require('cors')
const { config } = require('dotenv')
require('dotenv').config()
console.log(process.env.DB_USER)



const port =process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zz3lt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection error",err)
  const serviceCollection = client.db("tutorHouse").collection("service");
  const reviewCollection = client.db("tutorHouse").collection("review");
  const bookingTutorDataCollection = client.db("tutorHouse").collection(" bookingTutorData");
  const adminCollection = client.db("tutorHouse").collection("adminData");


  app.get('/service', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        res.send(items)
        console.log('from database', items)
      })
  })



 app.post('/addService', (req, res) => {
     const newService =req.body;
     console.log('adding new service',  newService)
     serviceCollection.insertOne(newService)
     .then(result =>{
         console.log(result.insertedCount)
         res.send(result.insertedCount > 0)
     })
 })



 app.delete('/deleteService/:id', (req, res) => {
  const id = ObjectID(req.params.id)
  // console.log('delete this', id );
  serviceCollection.findOneAndDelete({ _id: id })
    // .then(documents => res.send(!!documents.value))
    .then(result => {
      res.send({ count: result.deleteCount > 0 })

    })
})



 app.delete('/deleteReview/:id', (req, res) => {
  const id = ObjectID(req.params.id)
  // console.log('delete this', id );
  reviewCollection.findOneAndDelete({ _id: id })
    // .then(documents => res.send(!!documents.value))
    .then(result => {
      res.send({ count: result.deleteCount > 0 })

    })
})



 app.get('/review', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        res.send(items)
        console.log('from database', items)
      })
  })


  app.post('/addReview', (req, res) => {
    const newReview =req.body;
    console.log('adding new review', newReview)
    reviewCollection.insertOne(newReview)
    .then(result =>{
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})


app.post('/bookingTutorData', (req, res) => {
  const newBookingTutorData =req.body;
  console.log('adding new review',  newBookingTutorData)
  bookingTutorDataCollection.insertOne( newBookingTutorData)
  .then(result =>{
      console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
  })
})


app.post('/isAdmin', (req, res) => {
  const email =req.body.email;
 adminCollection.find({email:email})
 .toArray((err,admin) =>{
  res.send(admin.length > 0)
})
})




app.get('/tutorBookedData', (req, res) => {
  
  bookingTutorDataCollection.find({email:req.query.email})
    .toArray((err, items) => {
      res.send(items)
      console.log('from database', items)
    })
})



app.get('/totalTutorBookedData', (req, res) => {
  
  bookingTutorDataCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database', items)
    })
})

          // addAdmin

app.post('/addAdmin', (req, res) => {
  const newAdmin =req.body;
  console.log('adding new service', newAdmin)
  adminCollection.insertOne(newAdmin)
  .then(result =>{
      console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
  })
})
              // getAdmin

//  createAdmin
app.get('/createAdmin', (req, res) => {
  adminCollection.find()
      .toArray((err, items) => {
        res.send(items)
        console.log('from database', items)
      })
  })
 



app.patch('/bookingTutorData/:id', (req, res) => {
  const id = ObjectID(req.params.id)
  console.log(req.body)
  console.log( id );
  bookingTutorDataCollection.updateOne({_id: id },
  {
    $set:{status:req.body.status}
  })
    // .then(documents => res.send(!!documents.value))
    .then(result => {
      res.send({ count: result.updateCount > 0 })
      console.log(result)

    })
})

  console.log('database connected successfully')
  // perform actions on the collection object
//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})