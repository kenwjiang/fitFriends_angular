const controller = require('../controller/controller.js');
const jwt = require('jsonwebtoken');

var path = require('path');


function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send("Unauthorized request");
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === "null"){
        return res.status(401).send('Unauthorized request');
    }
    let payload = jwt.verify(token, "secretKey");
    if(!payload){
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    next()
}

module.exports = function(app){
  //get room data;
  app.get("/getRoom/:id", controller.getRoom);

  //check to see if a chat exists
  app.post("/checkChat", controller.checkChatroom);

  //update user password
  app.post('/updatePassword', controller.updatePassword);

  //update user name and email
  app.post('/updateInfo', controller.updateInfo);

  //get all gym members in a default gym
  app.post('/getGymMembers', controller.getMembers);

  // set default gym
  app.post('/setDefaultGym/', controller.setDefaultGym);

  // update schedule
  app.post('/updateSchedule', controller.updateSchedule);

  // update goals
  app.post('/updateGoals', controller.updateGoals);

  //get self
  app.get('/getSelf/:id', controller.getSelf);

  //login user
  app.post('/loginUser', controller.login);

  // add register user
  app.post('/registerUser', controller.registerUser);

    app.all("*", (req,res,next) => {
        res.sendFile(path.resolve("./public/dist/public/index.html"))
    });
}
