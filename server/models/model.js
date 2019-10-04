const config = require('../config/config');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const {
    db: {
        host,
        port,
        name
    }
} = config.config;

const connectionString = `mongodb://${host}/${name}`;

mongoose.connect(connectionString, { useNewUrlParser: true });


const ChatSchema = new mongoose.Schema({
    chatroom_id: String,
    host: {type: Schema.Types.ObjectId, ref: "User"},
    guest: {type: Schema.Types.ObjectId,ref: "User"},
    msg: [{
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        message: {
            type: String,
            default: null
        },
        delivered: Boolean,
        read: Boolean
    }]
});

const PreferenceSchema = new mongoose.Schema ({
  user_id: {type: Schema.Types.ObjectId, ref: "User"},
  weight_loss: {type: Boolean, default:false},
  cardio: {type: Boolean, default:false},
  endurance: {type: Boolean, default:false},
  flexibility: {type: Boolean, default:false},
  muscle: {type: Boolean, default:false},
  strength: {type: Boolean, default:false},
  genFit: {type: Boolean, default:false},
  gender: {type: String, default:''},
})

const ScheduleSchema = new mongoose.Schema ({
  mon: {type: String, default: null},
  tues: {type: String, default: null},
  wed: {type: String, default: null},
  thurs: {type: String, default: null},
  fri: {type: String, default: null},
  sat: {type: String, default: null},
  sun: {type: String, default: null}
})


const UserSchema = new mongoose.Schema({
    fname: {
      type: String,
      required: true
    },
    lname:{
      type: String,
      required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
      type: String,
      required: true,
      unique: true
    },
    dob: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    imgUrl: {
      type: String,
      default: "assets/placeholder.png"
    },
    preference: {
      type: PreferenceSchema,
      default: null
    },
    default_gym:{
      type: String,
      default: null
    },
    schedule: {
      type:ScheduleSchema,
      default: null
    }},
    {timestamps: true}
)


mongoose.model("Chat", ChatSchema);
mongoose.model("Preference", PreferenceSchema);
mongoose.model("Schedule", ScheduleSchema);
mongoose.model("User", UserSchema);
const Chatroom = mongoose.model('Chat');
const User = mongoose.model('User');

UserSchema.plugin(uniqueValidator, {message: "This user already exists in our database!"})
mongoose.Promise = global.Promise;

module.exports = {
    User: User,
    Chatroom: Chatroom
}
