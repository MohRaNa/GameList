"use strict";
var fs = require("fs");
module.exports.obtener_juegos = function (req, res) {
  fs.readFile(__dirname + "/" + "juegos.json", "utf8", function (err, data) {
    console.log(err);
    console.log(data);
    res.end(data);
  });
};
module.exports.agregar_juego = function (req, res) {
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
module.exports.obtener_juego = function (req, res) {
  fs.readFile(__dirname + "/" + "juegos.json", "utf8", function (err, data) {
    const juegos = JSON.parse(data);
    const juego = juegos[req.params.gameIndex];
    console.log(juego);
    res.end(JSON.stringify(juego));
  });
};
// Dentro de gameCollectionController.js

module.exports.eliminar_juego = function (req, res) {
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
          res
            .status(500)
            .json({
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

module.exports.buscar_juegos = function (req, res) {
  const keyword = req.params.keyword.toLowerCase(); // Se asume que la palabra clave está en los parámetros de la ruta
  fs.readFile(__dirname + "/" + "juegos.json", "utf8", function (err, data) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error al leer el archivo de juegos." });
      return;
    }

    const juegos = JSON.parse(data);
    const juegosFiltrados = juegos.filter((juego) =>
      juego.nombre.toLowerCase().includes(keyword)
    );

    res.json(juegosFiltrados);
  });
};
