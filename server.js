const http = require("http"); //Importer le package http node
const app = require("./app"); // Importer le package app.js

app.set("port", process.env.PORT || 3000);
const server = http.createServer(app);
/*cette methode () prend en argument la fonction qui sera appelé  à chaque requete recu par le serveur*/

server.listen(process.env.PORT || 3000);

// le server node est bien entrain de nous retourner notre application express !
/* un Middlwar est une fonction qui recoit une requete, ainsi qu'une reponse, 
qui les effectuent, et qui peut passer l'éxecution à un prochain Middelwar */
