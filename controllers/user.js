const bcrypt = require("bcrypt"); // import le package de cryptage pour les mdp (bcrypt)
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/*la fonction signup va crypter le mdp, vas récuperer ensuite 
le mail ansi que le mdp et l'enregister dans la base de données*/
exports.signup = (req, res, next) => {
  //hasher le mdp / crypter le mdp
  bcrypt
    .hash(req.body.password, 10) // 10 = le sold c'est combien de fois on exécute l'algorithme de hachage
    .then((hash) => {
      // on récupere le hash de mdp, ensuite l'enregistrer dans la base de données, dans un "new user"
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "utilisateur crée" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
//connecter des utilisateurs existants
exports.login = (req, res, next) => {
  /* trouver le user dans la bdd qui correspond à l'adresse mail rentré par l'utilisateur,
  et si l'utilisateur n'existe pas, on renvoi une erreur */
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ erreur: "utilisateur non trouvé !" });
      }
      // On compare (avec la fonction compare de bcrypt) le mot de passe rentré, avec le hash qui est gardé dans la base de données
      //s'ils ne correspondent pas,on envoi une erreur 401 Unauthorized
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ erreur: "mot de passe incorrect" });
          }

          /*Si la comparaison est correct, c'est que l'utilisateur a rentrer des identifiants valable, donc
        on lui renvoi le userId et le token, (ce qui est attendu par le front-end)*/
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
              //"TOKEN_SECRET" la clé secrete pour l'encodage
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    //en cas de probleme de CO, ou lié à mongoDB
    .catch((error) => res.status(500).json({ error }));
};
