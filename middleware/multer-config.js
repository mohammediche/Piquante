const multer = require("multer"); // un paquage qui permet de capturer des fichiers envoyé avec des requetes http
// crée un middleware qui vas configurer multer, pour lui expliquer "comment géré les fichiers" et "quels noms de fichiers leur donné"
const MIME_TAPES = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};
const storage = multer.diskStorage({ // diskStorage pour l'enregistrer sur le disk
  //destination : une fonction qui vas expliquer a multer ou enregistrer les fichiers
  destination: (req, file, callback) => {
    callback(null, "images"); //null pour dire qu'il n'y pas eu d'erreur à ce niveau là
  },
  //filename : dire quel noms de fichiers utiliser, pour empecher d'avoir deux fichiers meme noms
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); //remplacer des espaces par des underscore
    /* création de l'extension qui sera l'élement de notre dictionnaire (MIME_TAPES) 
    qui correspond au mimeTypes du fichier envoyé par le front-end. */
    const extension = MIME_TAPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension); // Date.now : ajout d'un timestamp pour  rendre le nom le plus unique possible
  },
});
module.exports = multer({ storage }).single("image");
/* appeler la methode single pour dire que c'est un fichier unique et pas un groupe de fichiers.
 Et on explique à multer qu'il s'agit du fichier "image" uniquement */
