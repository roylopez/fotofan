var Image = require("../models/image.js").Image;
var owner_check = require("./image_permissions.js");

module.exports = function(req,res,next){
  Image.findById(req.params.id)
                .populate("creator")
                .exec(function(err,image){
                  if(image != null && owner_check(image,req,res)){
                    res.locals.image = image;
                    next();
                  }else{
                    res.redirect("/app");
                  }
                });
};
