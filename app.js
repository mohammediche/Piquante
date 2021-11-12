const express = require("express");
const app = express(); // app crée par express
const mongoose = require("mongoose");
/*  Mongoose est un package qui facilite les interactions avec notre base 
    de données MongoDB grâce à des fonctions extrêmement utiles.  */
const path = require("path");
const stuffRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();
mongoose
  .connect(process.env.SECRET_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //tout le monde pourra accéder à notre API
  res.setHeader(
    "Access-Control-Allow-Headers", //l'autorisation d'utiliser certains Headers
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods", //l'autorisation d'utiliser certaines methodes
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images"))); //À l'aide du package path et de la méthode Express static,on peut servir des ressources statiques. qui est "images". //dirname c le dossier là ou on va se trouver
app.use("/api/sauces/", stuffRoutes); // pour cette route, on utilise les router exposer par stuffRoutes
app.use("/api/auth", userRoutes);
app.use(helmet());
app.use(mongoSanitize());

module.exports = app; // exporter l'application
