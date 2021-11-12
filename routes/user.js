const express = require("express"); // on a toujours besoin d'express afin de crée un router.
const router = express.Router();
const userCtrl = require("../controllers/user"); //pour associé les fonctions aux différentes routes
const password = require("../middleware/password"); //pour avoir un password plus "fort"

// on a crée des routes post car le front-end vas également envoyer des informations(mail, password)
router.post("/signup", password, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
