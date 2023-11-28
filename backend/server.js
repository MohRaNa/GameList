const express = require("express");
const routes = require("./gameCollectionRoutes");
const app = express();
const port = 8585;
//Middlewares
//Este middleware sirve para parsear el contenido de los requests
//que están "url encoded"
app.use(express.urlencoded({ extended: true }));
//Este middleware nos sirve para recuperar el contenido del
//body del request y response.
app.use(express.json());
//Llamamos nuestras rutas.
routes(app);
//Iniciamos el servidor
app.listen(port);
console.log("Servidor escuchando en puerto: " + port);
