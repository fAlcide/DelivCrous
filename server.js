const path = require('path')
const express = require("express")
const mongoose = require('mongoose');
const { title } = require('process');

mongoose.connect('mongodb://localhost:27017/DelivCrous');

const app = express() // starts a new Express app

const pagesDirectory = `${__dirname}/pages` // equivalent to __dirname + '/pages'

const Dish = mongoose.model("Dish", {title:String, description:String, price:Number})

app.use(express.static('public'))
app.use(express.json())

// GET de l'index
app.get("/", (req, res) => {
  res.sendFile(path.resolve(pagesDirectory,'home.html'))
})

//Ajout d'un plat
app.post("/dish", (req, res) => {
    // res.json(req.body)
    const dish = new Dish(req.body)  
    // const dish = new Dish({title:"Burger", description:"Burger sympa", price:"12"})  
    dish.save().then(res.sendFile(path.resolve(pagesDirectory,'addSuccess.html')))
    res.json(dish)
})

//Suppression d'un plat
app.delete("/dish/:id", async (req, res) => {
    Dish.findOneAndDelete(req.params.id)
      .then((dish) => res.json(dish))
      .catch(() => res.status(404).end())
  })

// GET /adlsfalsdfjk
app.get("*", (req, res) => {
  res.writeHead(404)
  res.end()
})

app.listen(3000, () => {
  console.log("App listening on port 3000")
})