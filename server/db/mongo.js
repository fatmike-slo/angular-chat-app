const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/chat" ,{useMongoClient:true});
mongoose.Promise = global.Promise;

const ChatUsersSchema = new mongoose.Schema({
  username:String
});

const UsersModel = mongoose.model("chatusers", ChatUsersSchema)


const connection = mongoose.connection;
connection.on("open", ()=> {console.log("connected to Db");});

module.exports.getUsers = (callback)=> {
  UsersModel.find({}, callback);
};
module.exports.newUser = (username, callback)=> {
  let newUsermodel = new UsersModel({
    username:username
  }).save(callback);
};
module.exports.deleteAll = (callback)=> {
  UsersModel.remove({}, callback);
};


