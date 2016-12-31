var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  username: {type:String,required:true,maxlength:[50,"El nombre de usuario es demasiado largo"]},
  password: {
    type:String,
    required:true,
    minlength:[5,"El password es muy corto"],
    validate:{
      validator:function(p){
        return this.passwordConfirmation == p;
      },
      message: "Las contraseñas no coinciden"
    }
  },
  age: {type:Number,min:[5,"La edad debe ser mayor a 5"],max:[100,"La edad debe ser menor a 100"]},
  email: {type:String, required: "El correo es obligatorio"},
  day_of_birth: Date,
  sex: {type:String,enum:{values:["M","F"],message:"Opción no valida"}}
});

/*
 String
 Number
 Date
 Buffer
 Boolena
 Mixed
 Objectid
 Array

 Adicional a las validaciones presentes en el anterior esquema esta match, match: [expresion regular,"Mensaje de error"]
*/

userSchema.virtual("passwordConfirmation").get(function(){
  return this.pc;
}).set(function(password){
  this.pc = password;
});


//El primer parametro mapea una coleccion user pero en plural, es decir users.
//Asi si la coleccion no existe de igual forma la crea con el nombre users
var User = mongoose.model("User",userSchema);

module.exports.User = User;
