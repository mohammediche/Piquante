const mongoose = require("mongoose");
/* création d'un Schema de données avec les information dont nos objets auront Besoin */
const thingSchema = mongoose.Schema({
  //   _id: { type: String, required: true }, // Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose,
  userId: { type: String, required: true },
  name: { type: String, required: true }, //un champ requis, sans name,on pourra pas enregister un thing dans la base
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, require: true },
  heat: { type: Number, required: true }, //nombre entre 1 et 10 décrivant la sauce
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: Array, required: true }, // tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
  usersDisliked: { type: Array, required: true },
});
module.exports = mongoose.model("sauce", thingSchema); //exporter le model correspondent
