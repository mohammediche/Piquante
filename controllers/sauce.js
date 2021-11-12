const Sauce = require("../models/sauce");
const fs = require("fs"); //fs = fille system. on import ceci Pour avoir accés aux differentes oppérations lié aux systemes du fichiers

exports.creatSauce = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce); // extraire l'objet json du "sauce"
  delete thingObject._id; //enlever l'id car il sera générer par mongoDB automatiquement
  const sauce = new Sauce({
    //title : req.body.title,
    ...thingObject, //un raccourci qui s'applle "spread" au lieu de détaillé tout un par un, title, description etc...
    // Modifier l'url d'image, car notre front-end ne sait pas l'url de l'image vu que c'est notre middleware multer qui a générer ce fichier.
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    //req.protocol s'agit du https ou http
    //req.get("host") s'agit de la rascine de notre serveur
    //req.file.filename c'est le nom du fichier
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};
// une fonction qui traite les modif
const update = (sauce, id) => {
  return Sauce.updateOne({ _id: id }, sauce);
};

exports.modifySauce = (req, res, next) => {
  const thingObject = req.file //si req.file existe / si l'utilisateur à modifié l'image
    ? {
        ...JSON.parse(req.body.sauce), //on récupere le string sauce, on le parse en objet // récuperer toutes les informations sur l'objet qui sont dans cette partie de la requete.
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      } //s'il n'existe pas, on prend simplement le body de la requete comme on faisait auparavent
    : req.body;

  if (req.file) {
    Sauce.findOne({ _id: req.params.id }) // trouver l'objet dans la BDD | _id est égale a l'id envoyé dans les parametres de req.
      .then((sauce) => {
        // une fois trouver, on extrait le filename à supprimer
        const filename = sauce.imageUrl.split("/images/")[1]; // (split renvoi un tableau de 2 élements, un qui vient avant le /images/, et un apres qui est le nom du fichier(filename))
        fs.unlink(`images/${filename}`, () => {
          //on supprime avec unlink,
          console.log(filename);
          update({ ...thingObject, _id: req.params.id }, req.params.id)
            .then(() => res.status(200).json({ message: "objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error })); //500 = erreur serveur
  } else {
    update({ ...thingObject, _id: req.params.id }, req.params.id)
      .then(() => res.status(200).json({ message: "objet modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  // Sauce.updateOne(
  //   { _id: req.params.id },
  //   { ...thingObject, _id: req.params.id }
  // )
  //   .then(() => res.status(200).json({ message: "objet modifié !" }))
  //   .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // trouver l'objet dans la BDD | _id est égale a l'id envoyé dans les parametres de req.
    .then((sauce) => {
      // une fois trouver, on extrait le filename à supprimer
      const filename = sauce.imageUrl.split("/images/")[1]; // (split renvoi un tableau de 2 élements, un qui vient avant le /images/, et un apres qui est le nom du fichier(filename))
      fs.unlink(`images/${filename}`, () => {
        //on supprime avec unlink,
        Sauce.deleteOne({ _id: req.params.id }) //une fois supprimer, on supprime egalement l'objet dans la BDD en renvoyant Then et catch selon si ca a fonctionner ou pas
          .then(() => res.status(200).json({ message: "objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error })); //500 = erreur serveur
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //Sauce est ensuite retourné dans une Promise et envoyé au front-end ;
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.noteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const userId = req.body.userId;
    const nombreDesLikes = req.body.like;
    let message;
    console.log(req.body);

    // Utilisateur aime la sauce !
    if (nombreDesLikes === 1 && !sauce.usersLiked.includes(userId)) {
      sauce.usersLiked.push(userId);
      sauce.likes++;
      message = "Utilisateur aime cette sauce !";
    }
    // Utilisateur n'aime pas la sauce !
    if (nombreDesLikes === -1 && !sauce.usersDisliked.includes(userId)) {
      sauce.usersDisliked.push(userId);
      sauce.dislikes++;
      message = "Utilisateur n'aime pas la sauce !";
    }
    // Utilisateur change sa note
    if (nombreDesLikes === 0) {
      if (sauce.usersLiked.includes(userId)) {
        sauce.usersLiked.pull(userId);
        sauce.likes--;
        message = "utilisateur annule son like";
      } else if (sauce.usersDisliked.includes(userId)) {
        sauce.usersDisliked.pull(userId);
        sauce.dislikes--;
        message = "utilisateur annule son dislike";
      }
    }
    sauce
      .save()
      .then(() => res.status(200).json({ message: message }))
      .catch((error) => res.status(500).json({ error }));
  });
};
