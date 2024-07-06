"use strict";
module.exports = function (app, db) {
  const gameCollection = require("./controllers/gameCollectionController");
  const userCollection = require("./controllers/userCollectionController");
  const logsController = require("./controllers/logsController");

  app
    .route("/games")
    .get((req, res) => gameCollection.obtener_juegos(req, res, db))
    .post((req, res) => gameCollection.agregar_juego(req, res, db));

  app
    .route("/games/:gameId")
    .get((req, res) => gameCollection.obtener_juego(req, res, db))
    .delete((req, res) => gameCollection.eliminar_juego(req, res, db));

  app
    .route("/games/search/:keyword")
    .get((req, res) => gameCollection.buscar_juegos(req, res, db));
  app
    .route("/games/search/collection/:keyword")
    .get((req, res) => gameCollection.buscar_juegos_nombre(req, res, db));

  app
    .route("/login")
    .post((req, res) => userCollection.login_user(req, res, db));

  app
    .route("/usersps")
    .get((req, res) => userCollection.obtener_userps(req, res, db));
  app
    .route("/usuario")
    .get((req, res) => userCollection.obtener_user(req, res, db));

  app
    .route("/logs/:username")
    .get((req, res) => logsController.obtenerLogsPorUsuario(req, res, db));

  app
    .route("/login")
    .post((req, res) => userCollection.login_user(req, res, db));

  app
    .route("/logout")
    .post((req, res) => userCollection.logout_user(req, res, db));
  app.post("/agregar-juego/:gameId", (req, res) =>
    gameCollection.add_game_collection(req, res, db)
  );
};
