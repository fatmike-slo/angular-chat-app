let listAll = [];

let express = require("express");
let app = express();
let socket = require("socket.io");

const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require("cors");

// const index = require('./routes/index');
// const api = require('./routes/api');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
//set up the session, we need it to erase db data when user finishes


app.use(express.static(path.join(__dirname, './dist')));

app.get("/", (req,res)=> {
  res.sendFile(path.join(__dirname, "./dist/index.html"))
})


// app.use('/', index);
// app.use("/api", api);


const port = process.env.PORT || 3000;

const server = app.listen(port, ()=> {
  console.log("online at port", port);
})


// 1. POVEZEMO IO Z STREZNIKOM
let io = socket(server);



// 2. UPALIMO POVEZAVO IN CAKAMO KLIENTA DA SE JAVI
io.on('connection', (socket)=> {
  console.log("socket connection established", socket.id, " -------------------------");
  socket.emit("get-users", (listAll));


  socket.on("get-users", (data)=> {

    socket.emit("get-users", (listAll));
  })
  socket.on("onClientEmit", (data)=> {
    // emit to all of the sockets connections
    io.sockets.emit("onClientRecieve", data);
  });
  socket.on("typing-message", (data)=> {
    socket.broadcast.emit("typing-message", data);
  });

  socket.on("create-user", (data)=> {
    let canRegister;
    console.log("tle", data);
    console.log("listally", listAll);
    listAll.forEach((item)=> {
      if(item.username === data.username) {
        canRegister = false;
      }
    });
    if(canRegister === false) {
      socket.emit("create-user", "username alrdy taken");
    }
    else {
      listAll.push({
        username:data.username,
        id:socket.id
      });
      socket.emit("create-user", data);
    }
  });

  //logout
  socket.on("logout", (data)=> {
    listAll.forEach((item, index)=> {
      if(item.username === data) {
        listAll.splice(index, 1);
      }
    })
  });
  // on browser closure
  socket.on("disconnect", ()=> {
    listAll.forEach((item)=> {
      if(socket.id === item.id) {
        // es2015 magic
        let indexUserData = listAll.findIndex((item)=> { return item.id === socket.id });
        listAll.splice(indexUserData, 1);
      }
    });
    console.log("a socket has been closed");
  }) 
});

