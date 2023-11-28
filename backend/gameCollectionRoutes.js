//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
module.exports = function (app) {
  const gameCollection = require("./gameCollectionController");
  app
    .route("/games")
    .get(gameCollection.obtener_juegos)
    .post(gameCollection.agregar_juego);

  app.route("/games/:gameIndex").get(gameCollection.obtener_juego);

  app
    .route("/games/:gameId")
    .get(gameCollection.obtener_juego)
    .delete(gameCollection.eliminar_juego);

  app.route("/games/search/:keyword").get(gameCollection.buscar_juegos);
};
