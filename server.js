const path = require('path')
const express = require("express")
const mongoose = require('mongoose');
const { title } = require('process');
const { json } = require('express/lib/response');

db = mongoose.connect('mongodb://localhost:27017/DelivCrous');

const app = express() // starts a new Express app

const pagesDirectory = `${__dirname}/pages`

//Model Dish
const Dish = new mongoose.model("Dish", new mongoose.Schema({
  title:String, description:String, price:Number, allergens:String
}))

//Model Cart
const Cart = new mongoose.model("Cart", new mongoose.Schema({
  dishes:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dish"
  },
  state:{type:Number, default:0},
  adress:{type:String, default:""}
}))

app.use(express.static('public'))
app.use(express.json())

//Création d'un plat
app.post("/dish", (req, res) => {
  const dish = new Dish(req.body)  
  dish.save().then(
    res.status(201).json({ message: 'Plat créé !', dish:dish })
  )
})

//Récupére tous les plats
app.get("/allDishes", (req, res) => {
  dish = Dish.find().then((p) =>{
    res.send(p);
  });
})

//Récupére un plat selon un id donné
app.get("/dish/:id", (req, res) => {
  Dish.findById(req.params.id).then((p) =>{
    res.send(p);
  });
})

//Création d'un Panier
app.post("/cart", (req, res) => {
    const cart = new Cart()  
    cart.save().then(
      res.status(201).json({ message: 'Cart créé !', cart:cart})
    )
})

//Récupére un panier selon un id donné
app.get("/cart/:id", (req, res) => {
  Cart.findById(req.params.id).then((p) =>{
    res.send(p);
  });
})

//Ajout d'un plat avec un id donné dans un panier avec un id donné
app.post("/addDishToCart", (req, res) => {
  Dish.findById(req.body.idDish).then((d)=>{
      Cart.findOneAndUpdate(
        { _id: req.body.idCart }, 
        { $push: { dishes: d  }}
      ).then(() => res.status(201).json({ message: 'Plat ajouté au cart !' }));
    })
  })

//Supression d'un plat avec un id donné d'un panier avec un id donné
app.post("/removeDishFromCart", (req, res) => {
  Dish.findById(req.body.idDish).then((d)=>{
      Cart.findOneAndUpdate(
        { _id: req.body.idCart }, 
        { $pull: { dishes:  req.body.idDish }}
      ).then(() => res.status(201).json({ message: 'Plat supprimé du cart !' }));
    })
  })  
  
//Récupère tous les les plats d'un cart avec un id donnée 
app.get("/allDishesFromCart/:id", (req, res) => {
  Cart.findById(req.params.id).select("dishes").then((p) =>{
    Dish.find().where('_id').in(p.dishes).then((d)=>{
      res.send(d)
    })
  });
})

//Suppression d'un plat
app.delete("/dish/:id", async (req, res) => {
  Dish.findOneAndDelete(req.params.id)
    .then((dish) => res.json(dish))
    .catch(() => res.status(404).end())
})

//Validation d'un panier
app.post("/confirmCart", (req, res) => {
  Dish.findById(req.body.idDish).then((d)=>{
    Cart.findOneAndUpdate(
      { _id: req.body.idCart }, 
      { $push: { state: 1 }}
    ),
    Cart.updateOne({_id: req.body.idCart}, {
      state: 1, 
      adress: req.body.adress
  }).then(() => res.status(201).json({ message: 'Panier validé' }));
  })
})

// GET /adlsfalsdfjk
app.get("*", (req, res) => {
  res.writeHead(404)
  res.end()
})

app.listen(3000, () => {
  console.log("App listening on port 3000")
})