const path = require('path')
const express = require("express")
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/DelivCrous');

const app = express() // starts a new Express app

const pagesDirectory = `${__dirname}/pages` // equivalent to __dirname + '/pages'

const Dish = mongoose.model("Dish", {title:String, picPath:String, description:String, price:Number, alergene:String})



app.use(express.static('public'))

// GET de l'index
app.get("/", (req, res) => {
  res.sendFile(path.resolve(pagesDirectory,'home.html'))
})

//Ajout d'un plat
app.post("/dish", (req, res) => {
    const dish = new Dish({title:"Pizza", picPath:'pic/pizza.jpg', description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi facere repudiandae reiciendis, laborum natus a ipsum enim impedit nesciunt accusamus itaque consectetur similique, temporibus non autem, nam dolorum culpa et.", price:12, alergene:'E110'})  
    dish.save().then(res.sendFile(path.resolve(pagesDirectory,'addSuccess.html')))
})

app.delete("/dish:id", (req, res) => {
    const dish = new Dish({title:"Pizza", picPath:'pic/pizza.jpg', description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi facere repudiandae reiciendis, laborum natus a ipsum enim impedit nesciunt accusamus itaque consectetur similique, temporibus non autem, nam dolorum culpa et.", price:12, alergene:'E110'})  
    dish.save().then(res.sendFile(path.resolve(pagesDirectory,'addSuccess.html')))
})

// GET /adlsfalsdfjk
app.get("*", (req, res) => {
  res.writeHead(404)
  res.end()
})

app.listen(3000, () => {
  console.log("App listening on port 3000")
})