const mongoose = require("mongoose"); //importer le paquage mongoose
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //unique = permet de pas s'incrire plusieurs fois avec le meme mail.
  password: { type: String, required: true },
});
userSchema.plugin(uniqueValidator); // donc avec ce model, on ne pourra pas avec plusieurs users avec la meme adress mail
module.exports = mongoose.model("user", userSchema);
// le model s'appelle user , et on lui passe le userSchema comme schema de données.
