const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const controller = require('../controller/controller.js');
const model = require('../models/model');


io.on("connection", socket => {

    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
    };

    socket.on('getAllChats', id => {
      model.Chatroom.find({
        $and:([
          {$or: [{host:id}, {guest:id}]},
          {'msg.0': {"$exists": true}}
        ])
        })
        .populate('host')
        .populate('guest')
        .populate('msg.sender')
        .exec((err, data) => {
          if(err){
              console.log('Err')
          } else {
             socket.emit('allChatrooms', data);
          }
      })
    })

    // socket.on('subscribeChats', id=>{
    //   model.Chatroom.find({
    //     $and:([
    //       {$or: [{host:id}, {guest:id}]},
    //       {'msg.0': {"$exists": true}}
    //     ])
    //     })
    //     .populate('host')
    //     .populate('guest')
    //     .exec((err, data) => {
    //       if(err){
    //           console.log('Err')
    //       } else {
    //         console.log('rooms', data.length);
    //         socket.emit('numRooms', data.length);
    //       }
    //   })

    // })

    socket.on('getChatroom', roomId => {
        safeJoin(roomId);
          model.Chatroom
          .findOne({chatroom_id: roomId})
          .populate('host')
          .populate('guest')
          .populate('msg.sender')
          .exec((err, data)=> {
              if(err){
                  console.log('err', err);
              } else {
                  io.in(data.chatroom_id).emit('currentChat', data);
            }
          }
        )
    });

    socket.on('postMsg', data => {
      model.Chatroom.findOneAndUpdate({chatroom_id: data.chatroom_id}, {$push: {
        msg: {
          sender: data.sender_id,
          message: data.msg,
          delivered: true,
          read: false
        }
      }}, (err, res)=> {
        if(err){
          console.log('error', err);
        } else {
          model.Chatroom.findOne({chatroom_id: res.chatroom_id})
            .populate('host')
            .populate('guest')
            .populate('msg.sender')
            .exec((err,data)=> {
              if(err){
                console.log(err);
              } else {
                console.log('msgData', data);
                io.in(data.chatroom_id).emit('currentChat', data);  
              }
            })
          
        }
      }
    )
    })

    socket.on('createChat', data=> {
      model.Chatroom.create({
        chatroom_id: data.chatroom_id,
        host: data.host_id,
        guest: data.guest_id
      }, (err, res) => {
          if(err) {
            console.log("err", err);
          } else {

          }
      });
    });

})

http.listen(4444, ()=>{
    console.log('now listening on port 4444');
});
