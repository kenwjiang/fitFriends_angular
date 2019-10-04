const model = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const multer = require('multer');
var path = require('path');

// const DIR = './public/src/assets/uploads';

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, DIR);
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
// let upload = multer({storage: storage}).single('photo');


module.exports = {
    getSelf: (req, res)=> {
      model.User.findOne({_id: req.params.id}, (err, data)=>{
        if(err){
          res.status(401).send("Error finding user");
        }else {
          res.json(data);
        }
      })
    },

    login: function(req, res){
        model.User.findOne({username: req.body.username}, function(err, user){
            if(err){
                res.json(err);
            }
            else if(!user){
                res.status(401).send("Invalid username");
            }else{
                bcrypt.compare(req.body.password, user.password, function(error, data) {
                    if(error){
                        res.status(401).send('Error Hashing Password!')
                    } else if (data == false){
                        res.status(401).send('Invalid password!')
                    }else {
                        let payload = {subject: user._id};
                        let token = jwt.sign(payload, "secretKey");
                        res.status(200).send({token:token, user:user});
                    }
            })
        }
    })
    },
    //create new task
    registerUser: function(req, res){
        bcrypt.hash(req.body.password, 10, function(err, hash){
            if(err){
                res.status(401).send('Error Hashing pw');
            }else{
                model.User.create({
                    username:req.body.username,
                    password: hash,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    email: req.body.email
                }, function(err, data){
                    if(err){
                        res.json({message:"Error", error:err});
                    }else{
                        let payload = {subject: data._id}
                        let token = jwt.sign(payload, "secretKey");
                        res.status(200).send({token:token, id:data._id});
                    }
                })
            }
        })
    },
    createChat: (req, res)=>{
        model.Chatroom.create({
          chatroom_id: req.body.chatroom_id,
          host: req.body.host_id,
          guest: req.body.guest_id
        }, (err, data) => {
            if(err) {
                res.status(401).send("Error creating chat");
            } else {
                res.json(data);
            }
        });
    },

    getRoom: (req, res) => {
        model.Chatroom
        .findOne({chatroom_id: req.params.id})
        .populate('host', 'username')
        .populate('guest', 'username')
        .populate('msg.sender', 'username')
        .exec((err, data)=> {
            if(err){
                res.status(401).send('Error getting chatroom');
            } else {
                res.json(data);
          }
        }
      )
  },

    postMsg: (req,res)=> {
      model.Chatroom.findOneAndUpdate({chatroom_id: req.body.chatroom_id}, {$push: {
        msg: {
          sender: req.body.sender_id,
          message: req.body.msg
        }
      }}, (err, data)=> {
        if(err){
          res.status(401).send('Error adding messages')
        } else {
          res.json(data);
        }
      }
    )
  },

    checkChatroom:(req, res)=> {
      model.Chatroom.find({
        $or: [
          { $and: [{ host: req.body.host_id}, {guest: req.body.guest_id}]},
          { $and: [{ host: req.body.guest_id}, {guest: req.body.host_id}]}
        ]
      }, (err, data)=> {
        if(err){
          res.status(401).send(err);
        }else {
          res.json(data);
        }
      }
    )
  },

  updateGoals: (req, res) => {
    model.User.findOneAndUpdate({_id:req.body.id}, {$set: {preference: {
      user_id: req.body.id,
      gender: req.body.goals.gender,
      weight_loss: req.body.goals.weight_loss,
      cardio: req.body.goals.cardio,
      endurance: req.body.goals.endurance,
      flexibility: req.body.goals.flexibility,
      strength: req.body.goals.strength,
      muscle: req.body.goals.muscle,
      genFit: req.body.goals.genFit
        }
      }
    }, (err, data)=> {
      if(err){
        res.json({message: "ERROR", error: err})
      }else {
        res.json(data);
      }
    })
  },
  updateSchedule:(req, res)=>{
    model.User.findOneAndUpdate({_id:req.body.id}, {$set : { schedule:{
      mon: req.body.schedule.mon,
      tues: req.body.schedule.tues,
      wed: req.body.schedule.wed,
      thurs:req.body.schedule.thurs,
      fri:req.body.schedule.fri,
      sat: req.body.schedule.sat,
      sun:req.body.schedule.sun
    }}},(err, data)=>{
      if(err){
        res.json(err);
      } else {
        res.json(data);
      }
    })
  },

  setDefaultGym: (req, res)=> {
    model.User.findOneAndUpdate({_id: req.body.id}, {$set: {default_gym: req.body.gym_id}}, (err, data)=>{
      if(err){
        res.json(err);
      } else {
        res.json(data);
      }
    })
  },

  //return all members except for self
  getMembers: (req, res)=> {
    model.User.find({_id: {$ne: req.body.self_id}, default_gym: req.body.gym_id}, (err, data)=>{
      if(err){
        res.json(err);
      } else {
        res.json(data);
      }
    })
  },
  updateInfo:(req, res)=> {
    model.User.findOneAndUpdate({_id: req.body._id}, {$set:{
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email
    }}, (err, data)=>{
      if(err){
        res.json(err);
      } else {
        res.json(data);
      }
    })
  },

  updatePassword:(req, res)=> {
    model.User.findOne({_id: req.body.id}, function(err, user){
        if(err){
            res.json(err);
        }
        else if(!user){
            res.status(401).send("Invalid userId");
        }else{
            bcrypt.compare(req.body.old, user.password, function(error, data) {
                if(error){
                    res.status(401).send('Error comparing passwords')
                } else if (data === false){
                  res.status(401).send('Invalid Password!')
                } else {
                    bcrypt.hash(req.body.new, 10, function(err, hash){
                      if(err){
                        res.status(401).send("Error hashing pw")
                      } else {
                        user.password = hash;
                        user.save();
                        res.json({user: user});
                      }
                  })
                }
          })
          }
        })
      },
      
    setAvatar: (req, res)=>{
      model.User.findOneAndUpdate({_id: req.body.id}, {$set:{
        imgUrl: req.body.imgString
      }}, (err, data)=> {
        if(err) {
          console.log(err);
          res.status(500).send('err', err);
        } else {
          model.User.findOne({_id: data._id}, (err, data)=> {
            if(err){
              console.log(err)
            } else {
              res.json(data);
            }
          })
         
        }
      })
    }
}
