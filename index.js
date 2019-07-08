// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express(); //create server

server.use(express.json()); //parse JSON

//GET ALL 
server.get('/api/users', (req, res) => {
    db.find()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({ error: "The users information could not be retrieved." });
    })
})

//GET SPECIFIC USER
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.findById(id)
        .then(user => {
            if(user){
                res.status(200).json(user);
            }else{
                res.status(404).json({  message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be retrieved." });
    })
})
//POST
server.post('/api/users', (req, res) => {
    const postInfo = req.body; //store the data
     if (!postInfo.name || !postInfo.bio){
         res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
         //  req.abort();
     } else{
     db.insert(postInfo)
        
        .then(user => {
             //if postInfor.name isn't there, it gives a 500 instead of the 400 for some reason
                res.status(201).json(user); //this returns the new users ID
        
        })
    
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the user to the database" });
        })
    }
})
//DELETE
server.delete('/api/users/:id', (req, res) => {
    const { id }  = req.params;
   

    db.remove(id)
        .then(removed => {
            if(removed){
            
            res.status(200).json(id);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be removed" });
    })
})
//UPDATE
server.put('/api/users/:id', (req, res) => {

    const { id } = req.params;
    const updates = req.body;

    if(!updates.name || !updates.bio){
        res.status(400).json({ message: "Please provide name and bio for the user." })
    } else{
        db.update(id, updates)
            .then(updated => {
                if(updated){
                    res.status(200).json(updated);
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                } 
            }) 
            .catch(err => {
                res.status(500).json(err);
        })
    }
})
//LISTEN
const port = 5000;
server.listen(port, () => {
    console.log(`running on port ${port}`);
})