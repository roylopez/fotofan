var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//var session = require("express-session");
//var session = require("cookie-session");
var User = require("./models/user.js").User;
var routerApp = require("./routes.js");
var sessionMiddleware = require("./middlewares/session.js");
var methodOverride = require("method-override");

var session = require("express-session");
var redisStore = require("connect-redis")(session);
var realtime = require("./realtime.js");

//Esto es para socket.io
var http = require("http");

var app = express();

//Esto es para socket.io
var server = http.Server(app);

var redisSessionMiddleware = session({
  store: new redisStore({}),
  secret: "super ultra secret password"
});

mongoose.connect("mongodb://localhost/fotofan");

app.set("view engine","jade");
app.use("/assets",express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
//app.use(session({secret:"jkdfj34343kdkfkd", resave:false, saveUninitialized:false}));

app.use(redisSessionMiddleware);

realtime(server,redisSessionMiddleware);

//esto se utiliza para cookies session
//app.use(session({name:"session",keys:["llave-1","llave-2"]}));

app.get("/",function(req,res){
  console.log(req.session.user_id);
  res.render("index");
});

app.get("/singup",function(req,res){
  res.render("singup");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/users",function(req,res){
  User.find().then(function(users){
    console.log(users);
    res.send("Los usuarios han sido listados");
  });
});

app.post("/session",function(req,res){
  User.findOne({email:req.body.email,password:req.body.password},function(err,data){
    if (err) {
      console.log(String(err));
      res.send("Datos incorrectos");
    }else {
      //para evitar errores debo preguntar si data trae al usuario
      req.session.user_id = data._id;
      res.redirect("/app");
    }
  });
});

app.post("/users",function(req,res){
  var user = new User({
                       email:req.body.email,
                       password:req.body.password,
                       username:req.body.username,
                       passwordConfirmation:req.body.passwordConfirmation
                      });

  //Almacenamiento usando promesas
  user.save().then(function(user){
    res.send("Recibimos tus datos");
  },function(error){
    if (error) {
      console.log("No se pudo registrar el usuario");
    }
  });


  /*ALMACENAMIENTO ASINCRONO
  user.save(function(err,userGuardado,numeroDocsAfectados){
    if (err) {
      console.log(String(err));
    }
    res.send("Datos recibidos");
  });
  */
});

app.use("/app",sessionMiddleware);
app.use("/app",routerApp);

//app.listen(8000); Este cambio es para socket.io
server.listen(8000);
