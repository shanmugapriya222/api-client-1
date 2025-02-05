const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const menuItem = require('./model/menuItem')
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());
// connect to mongoDB

mongoose.connect("mongodb+srv://shanmugapriyab211:client1@cluster0.noafv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(()=>console.log('Connected to mongoDB atlas'))
  .catch((err)=>console.log('Failed to connect:',err));


//routes and endpoints

app.post('/menu',async(req,res)=>{
  const { name, description, price } = req.body;

  if(!name||!price){
    return res.status(400).json({error:"name and price are required"});
  }

  try{
    const newMenuItem = new menuItem({
      name,
      description,
      price
    });
    await newMenuItem.save();
    res.status(200).json({message:'Item added successfully', item: newMenuItem});
  }catch(err){
    res.status(500).json({message:'internal server error', details: err.message});
  }
});

app.get('/menu',async(req,res)=>{
  try{
    const items = await menuItem.find();
    res.status(200).json(items);
  }catch(err){
    res.status(500).json({message: 'Failed to retrive menu items', details: err.message});
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});