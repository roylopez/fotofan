var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var imageSchema = new Schema({
  title:{type:String,required:true},
  creator:{type:Schema.Types.ObjectId, ref:"User"}
});

var Image = mongoose.model("Image",imageSchema);

module.exports.Image = Image;
