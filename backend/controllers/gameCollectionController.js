const { ObjectId } = require("mongodb");
("use strict");
var fs = require("fs");
module.exports.obtener_juegos = async function (req, res, db) {
  try {
    const juegos = await db.collection("videojuegos").find({}).toArray();
    res.json(juegos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener juegos.", details: err });
  }
};

module.exports.agregar_juego = function (req, res, db) {
  fs.readFile(__dirname + "/" + "juegos.json", "utf8", function (err, data) {
    const array = JSON.parse(data);
    console.log(err);
    console.log(data);
    const nuevo = req.body;
    array.push(nuevo);
    fs.writeFile(
      __dirname + "/" + "juegos.json",
      JSON.stringify(array),
      "utf8",
      function (err, data) {
        console.log(err);
        res.end(err);
      }
    );
    res.end(JSON.stringify(array));
  });
};
module.exports.obtener_juego = function (req, res, db) {
  fs.readFile(__dirname + "/" + "juegos.json", "utf8", function (err, data) {
    const juegos = JSON.parse(data);
    const juego = juegos[req.params.gameIndex];
    console.log(juego);
    res.end(JSON.stringify(juego));
  });
};
// Dentro de gameCollectionController.js

module.exports.eliminar_juego = function (req, res, db) {
  const gameId = req.params.gameId;

  // Validar y sanitizar gameId aquí

  fs.readFile(__dirname + "/" + "juegos.json", "utf8", function (err, data) {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Error al leer el archivo de juegos.", details: err });
      return;
    }

    const juegos = JSON.parse(data);
    const juegoIndex = juegos.findIndex((juego) => juego.id === gameId);

    if (juegoIndex === -1) {
      res.status(404).json({ error: "Juego no encontrado." });
      return;
    }

    const juegoEliminado = juegos.splice(juegoIndex, 1)[0];

    fs.writeFile(
      __dirname + "/" + "juegos.json",
      JSON.stringify(juegos),
      "utf8",
      function (err) {
        if (err) {
          console.log(err);
          res.status(500).json({
            error: "Error al escribir en el archivo de juegos.",
            details: err,
          });
          return;
        }

        res.json({ mensaje: "Juego eliminado correctamente.", juegoEliminado });
      }
    );
  });
};

// Dentro de gameCollectionController.js

module.exports.buscar_juegos = async function (req, res, db) {
  const keyword = req.params.keyword.toLowerCase();

  try {
    const juegos = await db
      .collection("videojuegos")
      .find({ plataforma: keyword })
      .toArray();

    res.json(juegos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener juegos.", details: err });
  }
};

module.exports.buscar_juegos_nombre = async function (req, res, db) {
  const keyword = req.params.keyword.toLowerCase();

  try {
    const juegos = await db
      .collection("videojuegos")
      .find({ nombreJuego: { $regex: new RegExp(keyword, "i") } })
      .toArray();

    res.json(juegos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener juegos.", details: err });
  }
};

module.exports.add_game_collection = async function (req, res, db) {
  const apiKey = "56779ca0e9684d56b417ee3ebfcad1ed";
  const gameId = req.params.gameId;
  try {
    const apiURL = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;
    const gameInfo = await fetch(apiURL).then((response) => response.json());

    const firstParentPlatform = gameInfo.parent_platforms[0]?.platform || {};
    const firstDeveloper = gameInfo.developers[0] || {};

    const gameData = {
      _id: new ObjectId(),
      nombreJuego: gameInfo.name,
      plataforma: firstParentPlatform.slug,
      personajePrincipal: "UNKNOWN",
      developers: firstDeveloper.name,
      background_image: gameInfo.background_image,
    };

    // Insertar el juego en la colección de juegos en MongoDB
    await db.collection("videojuegos").insertOne(gameData);

    res.json({ mensaje: "Juego agregado exitosamente", juego: gameData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al agregar juego", details: err });
  }
};
