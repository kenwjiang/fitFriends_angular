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
      console.log('inside getallchats socket')
      model.Chatroom.find({
        $or: [
          {host:id},
          {guest:id}]
        })
        .populate('host', 'username')
        .populate('guest', 'username')
        .exec((err, data) => {
          if(err){
              console.log('Err')
          } else {
             socket.emit('allChatrooms', data);
          }
      })
    })

    socket.on('getChatroom', roomId => {

        safeJoin(roomId);
        socket.emit('currentChat', controller.getChatroom(roomId));
    });

    socket.on('postMsg', data => {
      model.Chatroom.findOneAndUpdate({chatroom_id: data.chatroom_id}, {$push: {
        msg: {
          sender: data.sender_id,
          message: data.msg
        }
      }}, (err, data)=> {
        if(err){
          console.log(err);
        } else {
          console.log("msg data ",data);
          io.emit('posted', data);
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
              console.log("error");
          } else {
            console.log(res);
            io.emit('refreshChat', res);
          }
      });
    });



    io.emit('chatrooms', app.get(controller.getAllRooms));
})

http.listen(4444, ()=>{
    console.log('now listening on port 4444');
});
