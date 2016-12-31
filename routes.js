var express = require("express");
var Image = require("./models/image.js").Image;
var imageMiddleware = require("./middlewares/find_image.js");

var redis = require("redis");
var client = redis.createClient();

var router = express.Router();

router.get("/",function(req,res){
  Image.find({}).populate("creator").exec(function(err,images){
    if (err) {
      console.log("Error");
    }
    res.render("app/home",{images:images});
  });
});

//REST

router.get("/imagenes/new",function(req,res){
  res.render("imagenes/new");
});

router.get("/imagenes/:id/edit",function(req,res){
  Image.findById(req.params.id,function(err,image){
    res.render("imagenes/edit",{image:image});
  });

  /**
    *solo seria necesario usar res.render("imagenes/edit",{image:image});
    *si se hace uso del middleware imageMiddleware, y no seria necesario pasar la imagen a
    la vista ya que esta se encuentra disponible en los locals
    */
});

router.all("/imagenes/:id*",imageMiddleware);

router.route("/imagenes/:id")
  .get(function(req,res){
    res.render("imagenes/show");
  })
  .put(function(req,res){
    res.locals.image.title = req.body.title;
    res.locals.image.save(function(err){
      if(err){
        res.redirect("imagenes/" + req.params.id + "/edit",{image:image});
      }else{
        res.render("imagenes/show");
      }
    });
  })
  .delete(function(req,res){
    Image.findOneAndRemove({_id:req.params.id},function(err){
      if (!err) {
        res.redirect("/app/imagenes");
      }else{
        console.log(err);
        res.redirect("/app/imagenes/"+req.params.id);
      }
    });
  });

router.route("/imagenes")
  .get(function(req,res){
    Image.find({creator: res.locals.user._id},function(err,images){
      res.render("imagenes/index",{images:images});
    });
  })
  .post(function(req,res){
    var data = {title: req.body.title, creator: res.locals.user._id};
    var image = new Image(data);
    image.save(function(err,imagen){
      if(!err){

        var imgJSON = {
          "id":imagen._id,
          "title":imagen.title
        };

        client.publish("images",JSON.stringify(imgJSON));
        res.redirect("/app/imagenes/" + imagen._id);
      }else {
        res.render(err);
      }
    });
  });

module.exports = router;
