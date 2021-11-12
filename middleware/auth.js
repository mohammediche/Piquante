const jwt = require("jsonwebtoken");

// exporter un middleware
module.exports = (req, res, next) => {
  try {
    //récuperer le token dans le headers autorisation
    const token = req.headers.authorization.split(" ")[1]; //on recupere seulement le 2eme element de ce tableau
    //2eme étape : décoder le token
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); // on vérifie le token
    //recuperer le userId de l'objet decodedToken
    const userId = decodedToken.userId; // le userId chiffré dans le token
    // console.log("Ceci est mon userId chiffré dans le token :" + userId);

    if (req.body.userId && req.body.userId != userId) {
      // vérifier si l'userId actuel correspond à l'userId de la sauce.
      //si jamais on a un userId dans le corp de la res, et que celui ci est different du userId, on renvoi une erreur
      throw "user ID non valide !";
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ error: error | "requéte non authentifée" });
  }
};
