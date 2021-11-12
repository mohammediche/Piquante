const express = require("express");
const router = express.Router(); //qui va nous permettre d'utiliser ex router.get au lieu de app.get
const stuffCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, stuffCtrl.creatSauce); // crée un nouvel objet avec un "fichier" image inclus(multer) avec la requete
router.put("/:id", auth, multer, stuffCtrl.modifySauce); // Modifie la sauce portant l'id spécifié
router.delete("/:id", auth, stuffCtrl.deleteSauce); // Supprimer la sauce portant l'id spécifié
router.get("/:id", auth, stuffCtrl.getOneSauce); // récupérer la sauce portant l'id spécifié
router.get("/", auth, stuffCtrl.getAllSauce); // récupérer toutes les sauces
router.post("/:id/like", auth, stuffCtrl.noteSauce); // permet de noter la sauce. like=1 ou like = -1 ou like = 0

module.exports = router;
